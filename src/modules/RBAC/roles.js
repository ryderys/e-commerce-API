const Roles = Object.freeze({
    quest: null,
    user: ['quest'],
    admin: ['user'],
    superAdmin: ['admin', 'user']
})

module.exports = Roles