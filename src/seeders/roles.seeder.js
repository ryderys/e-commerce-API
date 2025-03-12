const { default: mongoose } = require("mongoose")
const { PermissionModel } = require("../modules/RBAC/permission.model")
const { RoleModel } = require("../modules/RBAC/roles.model");
const APP_RESOURCES = require("../common/constants/resources");
const { config } = require("dotenv");
config()
const seedRoles = async () => {
    try {
      await mongoose.connect(process.env.MONGO_SEED_URI);
  
     
      // Fetch permissions
      const [fullAccessPerm, userManagementPerm] = await Promise.all([
        PermissionModel.findOne({ resource: APP_RESOURCES.ALL }),
        PermissionModel.findOne({ resource: APP_RESOURCES.USER })
      ]);
  
      if (!fullAccessPerm || !userManagementPerm) {
        throw new Error('❌ Required permissions not found');
      }
  
      // Define roles with inherited roles
      const superAdminRole = new RoleModel({
        name: 'super_admin',
        permissions: [fullAccessPerm._id],
        inherits: [],
        description: 'System super administrator'
      });
  
      const adminRole = new RoleModel({
        name: 'admin',
        permissions: [userManagementPerm._id],
        inherits: [superAdminRole._id],  // Inherit from super_admin
        description: 'Administrator with user management access'
      });
  
      const userRole = new RoleModel({
        name: 'user',
        permissions: await PermissionModel.find({
          actions: { $in: ['readOwn', 'updateOwn', 'deleteOwn'] }
        }).distinct('_id'),
        inherits: [],
        description: 'Regular application user'
      });
  
      // Insert roles into DB
      await RoleModel.insertMany([superAdminRole, adminRole, userRole]);
      console.log('✅ Roles seeded successfully');
    } catch (error) {
      console.error('❌ Role seeding failed:', error);
    } finally {
      await mongoose.disconnect();
    }
  };
  

module.exports = {
    seedRoles
}