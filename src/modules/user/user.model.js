const { default: mongoose } = require("mongoose");

const OTPSchema = new mongoose.Schema({
    code: { type: String},
    expiresIn: { type: Number, default: 0}
})

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        sparse: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: false
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
    },
    roles: [{
        type: mongoose.Types.ObjectId,
        ref: 'Role',
    }],
    directPermissions: [{
        type: mongoose.Types.ObjectId,
        default: []
    }],

}, {timestamps: true, versionKey: false, virtuals: true})



module.exports = {
    UserModel: mongoose.model("User", UserSchema)
}