const httpErrors = require("http-errors");
const { AuthMSG } = require("../../modules/auth/auth.msg");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../../modules/user/user.model");
const Authentication = async(req, res, next) => {
    try {
        const token = req?.cookies?.access_token;

        if(!token) throw new httpErrors.Unauthorized(AuthMSG.Login) 
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(typeof data === 'object' && 'id' in data){
            const user = await UserModel.findById(data.id, {
                accessToken: 0,
                otp:0,
                __v:0,
                updatedAt:0,
                verifiedMobile:0
            }).lean()
            if(!user) throw new httpErrors.Unauthorized(AuthMSG.UserNotFound)
            
            req.user = user
            return next()
        }
        throw new httpErrors.Unauthorized(AuthMSG.Login)
    } catch (error) {
        next(error)
    }
}

module.exports = Authentication