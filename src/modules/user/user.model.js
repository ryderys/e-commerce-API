const { default: mongoose } = require("mongoose");

const OTPSchema = new mongoose.Schema({
    code: { type: String},
    expiresIn: { type: Number, default: 0}
})

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken: {
        type: String,
    },
    verifiedMobile: {
        type: Boolean,
        default: false
    },
    revokedTokens: {
        type: [String],
        default: []
    },
    otp: {
        type: OTPSchema
    },
    lastOtpRequest: {
        type: Date
    }
}, {timestamps: true})



module.exports = {
    UserModel: mongoose.model("User", UserSchema)
}