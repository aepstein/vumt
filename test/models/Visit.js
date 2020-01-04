const { factory } = require('../setup')
require('../factories/visit')

describe('Visit', () => {
    it('creates a valid visit', () => {
        return factory.create('visit')
    })
})