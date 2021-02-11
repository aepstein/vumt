const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')
const { RestrictedKeyError } = require('../../lib/errors/models')

describe('Theme',() => {
    it('creates a valid advisory theme', async() => {
        await factory.create('theme')
    })
    it('should not save without a name', async () => {
        await factory.create('theme',{name: null}).should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with a duplicate name', async () => {
        const advisory = await factory.create('theme')
        await factory.create('theme',{name: advisory.name}).should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save without a color',async () => {
        await factory.create('theme',{color: null}).should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with an invalid color', async () => {
        await factory.create('theme',{color: 'chartreuse'}).should.eventually.be.rejectedWith(ValidationError)
    })
    describe('deleteOne()', () => {
        it('should proceed without any dependencies',async () => {
            const theme = await factory.create('theme')
            await theme.deleteOne()
        })
        it('should fail if dependent advisory exists', async() => {
            const theme = await factory.create('theme')
            await factory.create('advisory',{theme: theme.id})
            await theme.deleteOne().should.eventually.be.rejectedWith(RestrictedKeyError)
        })
    })
})