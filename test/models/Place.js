const { factory } = require('../setup')

describe('Place', () => {
    it('creates a valid place', () => {
        return factory.create('place')
    })
})