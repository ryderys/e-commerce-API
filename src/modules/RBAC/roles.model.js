const { default: mongoose } = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true, default: 'guest'},
    permissions: {type: [mongoose.Types.ObjectId], ref: "Permission", default: []},
    inherits: [{type: mongoose.Types.ObjectId, ref: 'Role', default: []}],
    description: {type: String, required: false}
}, {
    toJSON: {
        virtuals: true,
        versionKey: false
    }
})

// RoleSchema.virtual('effectivePermissions').get(function() {
//     const getPermissions = async (roleId, visited = new Set()) => {
//         if (visited.has(roleId.toString())) return [];
//         visited.add(roleId.toString());

//         const role = await RoleSchema.findById(roleId).populate('permissions inherits');
//         let permissions = [...role.permissions];

//         // Recursively fetch inherited permissions
//         if (role.inherits.length > 0) {
//             const inherited = await Promise.all(
//                 role.inherits.map(id => getPermissions(id, visited))
//             );
//             permissions = permissions.concat(...inherited);
//         }

//         return permissions;
//     };

//     return getPermissions(this._id);
// });

// RoleSchema.pre('save', function(next) {
//     const role = this;
//     // Check for circular inheritance
//     const checkCircular = (roleId, visited = new Set()) => {
//         if (visited.has(roleId.toString())) {
//             throw new Error('Circular inheritance detected');
//         }
//         visited.add(roleId.toString());
//         return RoleSchema.findById(roleId).then(role => {
//             if (role && role.inherits.length > 0) {
//                 return Promise.all(role.inherits.map(id => checkCircular(id, visited)));
//             }
//         });
//     };

//     if (role.inherits.length > 0) {
//         Promise.all(role.inherits.map(id => checkCircular(id)))
//             .then(() => next())
//             .catch(err => next(err));
//     } else {
//         next();
//     }
// });

module.exports = {
    RoleModel: mongoose.model("Role", RoleSchema)
}