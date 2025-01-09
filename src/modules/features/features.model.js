const { default: mongoose, Types } = require("mongoose");

const FeaturesSchema = new mongoose.Schema({
    title: {type: String, required: true},
    key: {type: String, required: true},
    type: {type: String, enum: ["number", "string", "array", "boolean"]},
    list: {type: String, default: []},
    guid: {type: String},
    category: {type: Types.ObjectId, ref: "Category", required: true},
})

module.exports = {
    FeaturesModel: mongoose.model("Feature", FeaturesSchema)
}