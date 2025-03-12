const { seedPermissions } = require("./permissions.seeder")
const { seedRoles } = require("./roles.seeder")
const { seedUsers } = require("./users.seeder")

const runSeeders = async () => {
    await seedPermissions()
    await seedRoles()
    await seedUsers()
    process.exit(0)
}

runSeeders()