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
    it('should not save without durationNights', async () => {
        const visit = await factory.build('visit',{durationNights: null})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with durationNights less than 0', async () => {
        const visit = await factory.build('visit',{durationNights: -1})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should accept a valid checkedIn date', async() => {
        const visit = await factory.create('checkedInVisit')
        visit.should.have.a.property('checkedIn')
    })
    xit('should not accept a checkedIn before the start date', async() => {
        const visit = await factory.create('visit')
        const earlyCheckIn = new Date()
        earlyCheckIn.setDate(earlyCheckIn.getDate()-1)
        visit.checkedIn = earlyCheckIn
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should accept a valid checkedOut date', async() => {
        const visit = await factory.create('checkedOutVisit')
        visit.should.have.a.property('checkedOut')
    })
    xit('should not accept a checkedOut before checkedIn', async() => {
        const visit = await factory.create('checkedInVisit')
        const earlyCheckOut = new Date(visit.checkedIn)
        earlyCheckOut.setHours(earlyCheckout.getHours()-1)
        visit.checkedOut = earlyCheckOut
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    xit('should not accept a checkedOut without a checkedIn', async () => {
        const visit = await factory.create('visit')
        visit.checkedOut = new Date()
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
})