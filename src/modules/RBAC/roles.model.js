const { default: mongoose } = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    permissions: {type: [mongoose.Types.ObjectId], ref: "Permission", default: []},
}, {
    toJSON: {
        virtuals: true,
        versionKey: false
    }
})

module.exports = {
    RoleModel: mongoose.model("Role", RoleSchema)
}