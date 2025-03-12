
const { default: mongoose } = require("mongoose")
const { UserModel } = require("../modules/user/user.model");
const { RoleModel } = require("../modules/RBAC/roles.model.js");
const { config } = require("dotenv");
config()



const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_SEED_URI);

   

    // Get roles
    const [superAdminRole, adminRole, userRole] = await Promise.all([
      RoleModel.findOne({ name: 'super_admin' }),
      RoleModel.findOne({ name: 'admin' }),
      RoleModel.findOne({ name: 'user' })
    ]);

    if (!superAdminRole || !adminRole || !userRole) {
      throw new Error('❌ Required roles not found');
    }

    // Sample users
    const users = [
      // Super Admin (Full Access)
      {
        fullName: 'System Administrator',
        mobile: '09123456789',
        username: 'superadminuser',
        roles: [superAdminRole._id],
        verifiedMobile: true
      },
      
      // Admin User
      {
        fullName: 'Admin User',
        mobile: '09399860788',
        username: 'adminuser',
        roles: [adminRole._id],
        verifiedMobile: true
      },

      // Regular Users
      {
        fullName: 'John Doe',
        mobile: '09123456780',
        username: 'userjohn',
        roles: [userRole._id],
        verifiedMobile: true
      },
      {
        fullName: 'Jane Smith',
        mobile: '09123456781',
        username: 'userjane',
        roles: [userRole._id],
        verifiedMobile: false
      }
    ];

    // Insert users
    await UserModel.insertMany(users);
    console.log('✅ Users seeded successfully');

    // Verify creation
    const createdUsers = await UserModel.find({
      mobile: { $in: ['09123456789', '09399860788'] }
    }).select('-password -__v');
    
    console.log('Created users:', createdUsers);

  } catch (error) {
    console.error('❌ User seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};


module.exports = {
    seedUsers
}