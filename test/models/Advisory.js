const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe("Advisory", () => {
    it('creates a valid advisory', async () => {
        await factory.create('advisory')
    })
    it('should not save without a label', async () => {
        let advisory = await factory.build('advisory',{label: null})
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
})