const { default: mongoose } = require("mongoose")
const { PermissionModel } = require("../modules/RBAC/permission.model")
const { RoleModel } = require("../modules/RBAC/roles.model")
const APP_RESOURCES = require("../common/constants/resources")
const { config } = require("dotenv")
config()

const permissions = [
    {
        resource: APP_RESOURCES.ALL,
        actions: ['manage'],
        description: 'full access'
    },
    {
        resource: APP_RESOURCES.CART,
        actions: ['create', 'readOwn', 'deleteOwn'],
        description: 'permission to manage own cart'
    },
    {
        resource: APP_RESOURCES.CATEGORY,
        actions: ['create', 'readOwn', 'deleteOwn'],
        description: 'permission to manage category'
    },
    {
        resource: APP_RESOURCES.FEATURES,
        actions: ['create', 'read', 'deleteOwn', 'updateOwn'],
        description: 'permission to manage features'
    },
    {
        resource: APP_RESOURCES.ORDER,
        actions: ['create', 'readOwn', 'deleteOwn', 'updateOwn'],
        description: 'permission to manage own orders'
    },
    {
        resource: APP_RESOURCES.ORDER,
        actions: ['update'],
        description: 'admin order access'
    },
    {
        resource: APP_RESOURCES.PRODUCT,
        actions: ['create', 'readOwn', 'deleteOwn', 'updateOwn'],
        description: 'permission to manage own product'
    },
    {
        resource: APP_RESOURCES.REPORT,
        actions: ['create', 'read', 'deleteOwn', 'update'],
        description: 'permission to manage Report'
    },
    {
        resource: APP_RESOURCES.REPORT,
        actions: ['read', 'update'],
        description: 'admin Report access'
    },
    {
        resource: APP_RESOURCES.REVIEW,
        actions: ['create', 'read', 'deleteOwn', 'updateOwn'],
        description: 'manage own review'
    },
    {
        resource: APP_RESOURCES.SAVEDITEMS,
        actions: ['create', 'readOwn', 'deleteOwn', 'updateOwn'],
        description: 'manage own saved items'
    },
    {
        resource: APP_RESOURCES.USER,
        actions: ['read'],
        description: 'admin user access'
    },
    {
        resource: APP_RESOURCES.USER,
        actions: ['readOwn', 'updateOwn'],
        description: 'permission to manage own user'
    },
    {
        resource: APP_RESOURCES.WALLET,
        actions: ['readOwn', 'updateOwn'],
        description: 'permission to manage own wallet'
    },
    {
        resource: APP_RESOURCES.TRANSACTION,
        actions: ['read'],
        description: 'admin transaction access'
    },
]

const seedPermissions = async() => {
    try {
            await mongoose.connect(process.env.MONGO_SEED_URI)
            await PermissionModel.insertMany(permissions)
            console.log('permissions seeded successfully')
    } catch (error) {
        console.error(`permission seeding failed: ${error}`)
    } finally {
        await mongoose.disconnect();
    }
}

module.exports = {
    seedPermissions
}