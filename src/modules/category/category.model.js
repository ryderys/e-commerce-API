const { default: mongoose, Types } = require("mongoose");

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

CategorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent"
})

function autoPopulate(next){
  this.populate([{path: "children", select: "title _id", options: {limit: 10}}])
  next()
}

CategorySchema.pre("find", autoPopulate).pre("findOne", autoPopulate)

module.exports = {
    CategoryModel: mongoose.model("Category", CategorySchema)
}