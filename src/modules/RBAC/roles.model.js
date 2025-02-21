const { default: mongoose } = require("mongoose");

const RoleSchema = new mongoose.Schema({
    role: {type: String, unique: true, required: true, enum: ['admin', 'user', 'guest', 'super_admin', 'special'], default: 'guest'},
    permissions: {type: [mongoose.Types.ObjectId], ref: "Permission", default: []},
    inherits: [{type: mongoose.Types.ObjectId, ref: 'Role'}]
}, {
    toJSON: {
        virtuals: true,
        versionKey: false
    }
})

module.exports = {
    RoleModel: mongoose.model("Role", RoleSchema)
}