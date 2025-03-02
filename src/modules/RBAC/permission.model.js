const { default: mongoose } = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    resource: {type: String, required: true, enum: ['product', 'review', 'category', 'features', 'order', 'cart', 'savedItems', 'user', 'report', 'transaction', 'wallet']}, //e.g product, order ...
    operations: {
        type: [{
            action: {type: String, enum: ['create', 'read', 'update', 'delete'], required: true},
            scope: {type: String, enum: ['global', 'own'], default: 'global'}
        }],
        required: true
    }
}, {
    toJSON: {
        virtuals: true
    },
    versionKey: false
})

module.exports = {
    PermissionModel: mongoose.model("Permission", PermissionSchema)
}