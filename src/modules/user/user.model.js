const { default: mongoose } = require("mongoose");

const OTPSchema = new mongoose.Schema({
    code: { type: String},
    expiresIn: { type: Number, default: 0}
})

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String
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
    hashedRefreshToken: {
        type: String,
        default: null
    },
    verifiedMobile: {
        type: Boolean,
        default: false
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