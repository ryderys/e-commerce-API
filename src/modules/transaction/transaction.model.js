const { default: mongoose } = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    amount: {type: Number, min: 0, required: true},
    type: {type: String, enum: ['deposit', 'withdrawal', 'purchase', 'refund', 'cashback']},
    status: {type: String, enum: ['pending', 'completed', 'failed'] ,default: 'pending'},
    currency: {type: String, enum: ['USD', 'EUR', 'GBP'] ,default: 'USD'},
    description: {type: String},
    order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true})

module.exports = {
    TransactionModel: mongoose.model('Transaction', TransactionSchema)
}