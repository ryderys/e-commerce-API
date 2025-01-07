const jwt = require("jsonwebtoken")
const httpErrors = require("http-errors")
const { AuthMSG } = require("../../modules/auth/auth.msg")
const sendResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        statusCode,
        data: {
            message,
            ...data
        }
    })
}

const signToken = {
    signAccessToken: (payload) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"})
    },
    signRefreshToken: (payload) => {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
    }
}

const verifyRefreshToken = (token, secret) => {
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        throw new httpErrors.Unauthorized(AuthMSG.InvalidRefreshToken)
    }
}


module.exports = {
    sendResponse,
    signToken,
    verifyRefreshToken
}