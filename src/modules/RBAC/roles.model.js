const { default: mongoose } = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    description: {type: String, default: ""},
    permissions: {type: [mongoose.Types.ObjectId], ref: "Permission", default: []},
    // inherits: [{type: mongoose.Types.ObjectId, ref: "Role"}]
}, {
    toJSON: {
        virtuals: true,
        versionKey: false
    }
})

module.exports = {
    RoleModel: mongoose.model("Role", RoleSchema)
}