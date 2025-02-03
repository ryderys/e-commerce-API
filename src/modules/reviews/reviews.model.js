const { default: mongoose } = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    rating: {type: Number, required: true, min: 1 , max: 5},
    comment: {type: String, trim: true},
    edited: {type: Boolean, default: false},
    editHistory: [{
        rating: {type: Number},
        comment: {type: String},
        editedAt: {type: Date},
    }]
}, {
    timestamps: true,
    versionKey: false
})

module.exports = {
    ReviewModel: mongoose.model("Review", ReviewSchema)
}