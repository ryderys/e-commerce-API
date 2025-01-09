const { default: mongoose } = require("mongoose");

const CategorySchema = new mongoose.Schema({
    title: { type: String ,required: true ,unique: true },
  slug: {type: String, required: true, index: true},
  icon: {type: String},
  parent: {type: Types.ObjectId, ref: 'Category', required: false},
  parents: {type: [Types.ObjectId], required: false, default: []},
}, {
  versionKey: false, id: false, toJSON: {
    virtuals: true,
    versionKey: false
  }
})

module.exports = {
    CategoryModel: mongoose.model("Category", CategorySchema)
}