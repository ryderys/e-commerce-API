const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    summary: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    tags: {type: [String], required: true},
    category: {type: mongoose.Types.ObjectId, ref: 'Category', required: true},
    price: {type: Number, required: true, default: 0, min: 0},
    count: {type: Number, default: 0, min: 0},
    images: {type: [String], required: false, default: []},
    supplier: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    features: {type: Object, default: {}},
    averageRating: {type: Number, default: 0, min: 0, max: 5},
    reviewCount: {type: Number, default: 0},
}, {
    timestamps: true,
    versionKey: false
})

ProductSchema.virtual("imagesURL").get(function(){
    return this.images.map(image => `${process.env.BASE_URL}:${process.env.PORT}/${image}`)
})

module.exports = {
    ProductModel: mongoose.model("Product", ProductSchema)
}