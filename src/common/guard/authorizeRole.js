const httpErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../../modules/user/user.model");
const { AuthMSG } = require("../../modules/auth/auth.msg");

const adminAuthMiddleware = async(req, res, next) => {
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
            if(!user || user.roles !== 'admin') throw new httpErrors.Unauthorized('admin access only')
            req.user = user
            return next()
            }
            throw new httpErrors.Unauthorized('please login to continue')
        } catch (error) {
        next(error)
    }
}

module.exports = adminAuthMiddleware