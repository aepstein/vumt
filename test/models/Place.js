const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe('Place', () => {
    it('creates a valid place', async () => {
        await factory.create('place')
    })
    it('should not save with an invalid timezone', async () => {
        const place = await factory.build('place',{timezone: 'America/Whoville'})
        await place.save().should.eventually.be.rejectedWith(ValidationError)
    })
})