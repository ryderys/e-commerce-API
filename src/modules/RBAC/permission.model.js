const { default: mongoose } = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    description: {type: String, default: ''}
}, {
    toJSON: {
        virtuals: true
    }
})

module.exports = {
    PermissionModel: mongoose.model("Permission", PermissionSchema)
}