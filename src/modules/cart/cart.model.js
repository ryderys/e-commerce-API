const mongoose = require("mongoose")

const CartItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: {type: Number, required: true, min: 1, max: 40},
    price: {type: Number, required: true}
}, {timestamps: false})

const CartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [CartItemSchema],
    totalQuantity: {type: Number, default: 0},
    totalPrice: {type: Number, default: 0},
    expiresAt: {type: Date, default: () => Date.now() + 30 * 60 * 1000}
}, {timestamps: true, versionKey: false})

module.exports = {
    CartModel: mongoose.model("Cart", CartSchema)
}