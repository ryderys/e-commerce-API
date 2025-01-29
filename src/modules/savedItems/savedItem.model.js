const { default: mongoose } = require("mongoose");

const SavedItemsSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    productId: {type: mongoose.Types.ObjectId, ref: "Product", required: true},
    savedAt: {type: Date, default: Date.now}
}, {versionKey: false})

module.exports = {
    SavedItemsModel: mongoose.model("SavedItems", SavedItemsSchema)
}