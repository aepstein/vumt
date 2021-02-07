const { factory, expect } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')
const { RestrictedKeyError } = require('../../lib/errors/models')

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
    describe("deleteOne()", () => {
        it("should succeed without dependencies", async () => {
            const place = await factory.create('place')
            await place.deleteOne()
            const dPlace = await Place.findOne({_id: place.id})
            expect(dPlace).to.be.null
        })
        it("should fail if a dependent visit via origin exists", async () => {
            const place = await factory.create('place')
            await factory.create('visit',{origin: place})
            await place.deleteOne().should.be.rejectedWith(
                RestrictedKeyError,
                'place cannot be deleted because dependent visit related by origin exists'
            )
        })
        it("should fail if a dependent visit via destinations exists", async () => {
            const place = await factory.create('place')
            await factory.create('visit',{destinations: [place,await factory.create('destinationPlace')]})
            await place.deleteOne().should.be.rejectedWith(
                RestrictedKeyError,
                'place cannot be deleted because dependent visit related by destinations exists'
            )
        })
    })
})