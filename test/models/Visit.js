const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe('Visit', () => {
    it('creates a valid visit', () => {
        return factory.create('visit')
    })
    it('should not save without an origin', async () => {
        const visit = await factory.build('visit',{originPlaceId: null})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
})