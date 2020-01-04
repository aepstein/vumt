const { factory } = require('../setup')

const User = require('../../models/User')

factory.define('user', User, {
    firstName: 'Bob',
    lastName: 'Marshall',
    email: factory.sequence('User.email', (n) => `bmarshall${n}@example.com`),
    password: 'noneofyourbusiness'
})

