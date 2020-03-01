const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe('Place', () => {
    it('creates a valid place', async () => {
        await factory.create('place')
    })
    it('should not save with duplicate place name', async () => {
        await factory.create('place',{name: 'Lost Pond'})
        const duplicate = await factory.build('place',{name: 'Lost Pond'})
        await duplicate.save().should.eventually.be.rejectedWith(
            ValidationError,
            `Path \`name\` must be unique. Value: \`Lost Pond\``
        )
    })
    it('should not save with an invalid timezone', async () => {
        const place = await factory.build('place',{timezone: 'America/Whoville'})
        await place.save().should.eventually.be.rejectedWith(ValidationError)
    })
})