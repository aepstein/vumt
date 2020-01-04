const { factory } = require('../setup')
require('../factories/Place')

describe('Place', () => {
    it('creates a valid place', () => {
        return factory.create('place')
    })
})