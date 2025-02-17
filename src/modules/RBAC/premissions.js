const Permissions = Object.freeze({
    product: {
        create: ['admin'],
        read: ['admin', 'user', 'guest'],
        update: ['admin'],
        delete: ['admin'],
    },
    category: {
        create: ['admin'],
        read: ['user'],
        update: ['admin'],
        delete: ['admin'],
    },
    review: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin'],
        delete: ['admin'],
        updateOwn: ['user'],
        deleteOwn: ['user'],
    },
    report: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin'],
        delete: ['admin'],
        updateOwn: ['user'],
        deleteOwn: ['user'],
    },
    feature: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
    },
    order: {
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
        create: ['user'],
        readOwn: ['user'],
        updateOwn: ['user'],
    },
    cart: {
        create: ['user'],
        readOwn: ['user'],
        updateOwn: ['user'],
    },
    savedItem: {
        create: ['user'],
        readOwn: ['user'],
        updateOwn: ['user'],
    },
    user: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin'],
        readOwn: ['user'],
        updateOwn: ['user'],
    },
})

module.exports = Permissions