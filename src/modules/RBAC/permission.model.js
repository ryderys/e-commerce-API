const { default: mongoose } = require("mongoose");
const APP_RESOURCES = require("../../common/constants/resources");


const PermissionSchema = new mongoose.Schema({
    resource: {type: String, enum: Object.values(APP_RESOURCES), required: true},
    actions: [{type: String, required: true}],
    description: {type: String, required: false},
}, {versionKey: false, timestamps: true});


module.exports = {
    PermissionModel: mongoose.model("Permission", PermissionSchema)
}