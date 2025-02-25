const { default: mongoose } = require("mongoose");



const WalletSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    balance: {type: Number, default: 0, min: 0},
    currency: {type: String, enum: ['USD', 'EUR', 'GBP'] ,default: 'USD'},
    isActive: {type: Boolean, default: true}
}, {timestamps: true})

module.exports = {
    WalletModel: mongoose.model("Wallet", WalletSchema)
}