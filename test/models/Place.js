const { factory } = require('../setup')
require('../factories/place')

describe('Place', () => {
    it('creates a valid place', () => {
        return factory.create('place')
    })
})