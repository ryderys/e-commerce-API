const mongoose = require("mongoose")

const CartItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: {type: Number, required: true},
})

const CartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [CartItemSchema],
    expiresAt: {type: Date, default: Date.now() + 30 * 60 * 1000}
})

module.exports = {
    CartModel: mongoose.model("Cart", CartSchema)
}