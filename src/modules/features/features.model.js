const { default: mongoose, Types } = require("mongoose");

const FeaturesSchema = new mongoose.Schema({
    title: {type: String, required: true}, //rang
    key: {type: String, required: true}, //color
    type: {type: String, enum: ["number", "string", "array", "boolean"]}, //color
    list: {type: Array, default: []}, // color choosing
    guid: {type: String}, // rahnama
    category: {type: Types.ObjectId, ref: "Category", required: true},
})

module.exports = {
    FeaturesModel: mongoose.model("Feature", FeaturesSchema)
}