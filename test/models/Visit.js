const { factory } = require('../setup')

describe('Visit', () => {
    it('creates a valid visit', () => {
        return factory.create('visit')
    })
})