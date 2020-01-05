const { factory } = require('../setup')

describe('User', () => {
    it('creates a valid user', () => {
        return factory.create('user')
    })
})