const { factory } = require('../setup')
require('../factories/Place')

describe('Place2', () => {
    it('creates a valid place', () => {
        return factory.create('place')
    })
})