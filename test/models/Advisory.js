const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')
const moment = require('moment')

describe("Advisory", () => {
    it('creates a valid advisory', async () => {
        await factory.create('advisory')
    })
    it('should not save without a label', async () => {
        let advisory = await factory.build('advisory',{label: null})
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with startOn after endOn', async () => {
        let advisory = await factory.build('advisory',{
            startOn: moment().add(1,'days'),
            endOn: moment().subtract(1,'days')
        })
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should save with startOn before endOn', async () => {
        await factory.create('advisory',{
            startOn: moment().subtract(1,'days'),
            endOn: moment().add(1,'days')
        })
    })
})