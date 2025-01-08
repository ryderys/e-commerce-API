const { getOtpSchema, checkOtpSchema } = require("../../common/validations/auth.validation");
const { UserModel } = require("../user/user.model")
const httpErrors = require("http-errors");
const { AuthMSG } = require("./auth.msg");
const {StatusCodes} = require("http-status-codes")
const {sendResponse, verifyRefreshToken, signToken, hashingUtils } = require("../../common/utils/helperFunctions");
const crypto = require("crypto");
const CookieNames = require("../../common/constants/cookieEnum");

class UserAuthController {
    async getOTP(req, res, next) {
       try {
        //validate request body
        await getOtpSchema.validateAsync(req.body);
        const {mobile} = req.body;

        //find user by mobile number
        const user = await UserModel.findOne({mobile});
        const now = Date.now();
        // generate OTP
        const rawOTP = `${crypto.randomInt(10000, 99999)}`;
        const hashedCode = hashingUtils.hashOTP(rawOTP);

        const otp = {
            code: hashedCode,
            expiresIn: now + 1000 * 60 * 1
        };

        //cooldown period for otp request
        const cooldownPeriod = 30 * 1000; //30s
        

        if(user){

            // Check if the last OTP request was within the cooldown period
            if(user.lastOtpRequest && (now - user.lastOtpRequest.getTime()) < cooldownPeriod){
                throw new httpErrors.TooManyRequests(AuthMSG.OTPCooldown);
            }

            //check if OTP is not expired
            if(user.otp && user.otp.expiresIn > now){
                throw new httpErrors.BadRequest(AuthMSG.OTPNotExpired);
            }

            //update the otp and last request time
            user.otp = otp;
            user.lastOtpRequest = new Date();
            await user.save();
            return sendResponse(res, StatusCodes.OK, AuthMSG.OTPSuccess, {code: rawOTP, mobile: user.mobile})
        } 
            //create new user with OTP
            const newUser = await UserModel.create({mobile, otp, lastOtpRequest: new Date()});
            return sendResponse(res, StatusCodes.CREATED, AuthMSG.OTPSuccess, {code: rawOTP, mobile: newUser.mobile})

       } catch (error) {
        next(error)
       }
    }

    async checkOTP(req, res, next) {
        try {
            await checkOtpSchema.validateAsync(req.body);
            const {mobile, code} = req.body;
            const user = await UserModel.findOne({mobile});
            if(!user) throw new httpErrors.BadRequest(AuthMSG.UserNotFound)
            
            const now = Date.now();
            if(user?.otp?.expiresIn < now) throw new httpErrors.BadRequest(AuthMSG.OTPExpired)

            const hashedInput = hashingUtils.hashOTP(code)
            if(user.otp.code !== hashedInput) throw new httpErrors.BadRequest(AuthMSG.InvalidOTP)
            
            if(!user.verifiedMobile) {
                user.verifiedMobile = true
                await user.save()
            }
            const accessToken = signToken.signAccessToken({mobile, id: user._id})
            const refreshToken = signToken.signRefreshToken({mobile, id: user._id})

            user.hashedRefreshToken = await hashingUtils.hashRefreshToken(refreshToken);

            user.otp = null
            await user.save()

            this.setToken(res, accessToken, refreshToken)
            return sendResponse(res, StatusCodes.OK, AuthMSG.LoginSuccess, {accessToken, refreshToken})
        } catch (error) {
            next(error)
        }
    }

    async refreshToken(req, res, next){
        try {
            const incomingRefreshToken = req.cookies[CookieNames.RefreshToken]
            if(!incomingRefreshToken) throw new httpErrors.Unauthorized(AuthMSG.RefreshTokenMissing)
                
            // verify the refresh token
            const decoded = verifyRefreshToken(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
            const user = await UserModel.findById(decoded.id)
            if(!user) throw new httpErrors.Unauthorized(AuthMSG.UserNotFound)
            
            if(!user.hashedRefreshToken) throw new httpErrors.Unauthorized(AuthMSG.TokenRevoked)

            const isValid = await hashingUtils.compareRefreshToken(incomingRefreshToken, user.hashedRefreshToken)
            if(!isValid)  throw new httpErrors.Unauthorized(AuthMSG.TokenRevoked)
    
            const accessToken = signToken.signAccessToken({mobile: decoded.mobile, id: decoded.id})
            const newRefreshToken = signToken.signRefreshToken({mobile: decoded.mobile, id: decoded.id})
           
            user.hashedRefreshToken = await hashingUtils.hashRefreshToken(newRefreshToken)
            await user.save()

            this.setToken(res, accessToken, newRefreshToken)
            return sendResponse(res, StatusCodes.OK, AuthMSG.TokenRefreshed, {accessToken, refreshToken: newRefreshToken})
        
        } catch (error) {
            next(error)        
        }
       }

    async logout(req, res, next){
        try {
            const userId = req.user._id;
            if(!userId) throw new httpErrors.BadRequest(AuthMSG.Login)
            const user = await UserModel.findById(userId)
            if(!user) throw new httpErrors.BadRequest(AuthMSG.UserNotFound)

            user.hashedRefreshToken = null
            res.clearCookie(CookieNames.AccessToken)
                .clearCookie(CookieNames.RefreshToken);

            return res.status(StatusCodes.OK)
                .json({
                    statusCode: StatusCodes.OK,
                    data: {
                        message: AuthMSG.LogoutSuccess
                    }
                })
        } catch (error) {
            next(error)
        }
    }


    setToken(res, accessToken, refreshToken) {
        return res
          .cookie(CookieNames.AccessToken, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60,
          })
          .cookie(CookieNames.RefreshToken, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
          });
      }

    
}