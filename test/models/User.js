const { factory } = require('../setup')
require('../factories/user')

describe('User', () => {
    it('creates a valid user', () => {
        return factory.create('user')
    })
})