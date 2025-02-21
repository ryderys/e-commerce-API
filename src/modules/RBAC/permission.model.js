const { default: mongoose } = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    resource: {type: String, required: true, }, //e.g product, order ...
    action: {type: [String], required: true}, //e.g create, read, update
    scope: {type: String, enum: ['global', 'own'], default: 'global'}
}, {
    toJSON: {
        virtuals: true
    }
})

module.exports = {
    PermissionModel: mongoose.model("Permission", PermissionSchema)
}