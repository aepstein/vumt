const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe('Visit', () => {
    it('creates a valid visit', () => {
        return factory.create('visit')
    })
    it('should not save without an origin', async () => {
        const visit = await factory.build('visit',{origin: null})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save without a startOn date', async () => {
        const visit = await factory.build('visit',{startOn: null})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save without groupSize', async () => {
        const visit = await factory.build('visit',{groupSize: null})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with groupSize less than 1', async () => {
        const visit = await factory.build('visit',{groupSize: 0})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
})