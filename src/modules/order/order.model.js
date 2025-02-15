const { default: mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    products: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true, min: 1},
            price: {type: Number, required: true, min: 0}
        }
    ],
    totalAmount: {type: Number, required: true, min: 0},
    status: {type: String, enum: ['pending','processing', 'shipped', 'delivered', 'canceled'], default: 'pending'},
    shippingInfo: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zipCode: {type: String, required: true},
        country: {type: String, required: true},
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal']},
    trackingNumber: {type: String},
}, {
    versionKey: false,
    timestamps: true
})

module.exports = {
    OrderModel: mongoose.model("Order", OrderSchema)
}
