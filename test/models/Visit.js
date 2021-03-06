const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')
const Visit = require('../../models/Visit')
const Advisory = require('../../models/Advisory')

describe('Visit', () => {
    it('creates a valid visit', async () => {
        await factory.create('visit')
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
    it('should not save without number of parked vehicles', async () => {
        const visit = await factory.build('visit',{parkedVehicles: null})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with invalid number of parked vehicles', async () => {
        const visit = await factory.build('visit',{parkedVehicles: -1})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should accept a valid checkedIn date', async() => {
        const visit = await factory.create('checkedInVisit')
        visit.should.have.a.property('checkedIn')
    })
    it('should not accept a checkedIn more than one day before the start date', async() => {
        const visit = await factory.create('visit')
        const earlyCheckIn = new Date(visit.startOn)
        earlyCheckIn.setHours(earlyCheckIn.getHours()-25)
        visit.set({checkedIn: earlyCheckIn})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not accept a checkIn more than a day after the scheduled end', async() => {
        const visit = await factory.create('visit')
        const lateCheckIn = new Date(visit.startOn)
        lateCheckIn.setHours(lateCheckIn.getHours()+25)
        visit.set({checkedIn: lateCheckIn})
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should accept a valid checkedOut date', async() => {
        const visit = await factory.create('checkedOutVisit')
        visit.should.have.a.property('checkedOut')
    })
    it('should not accept a checkedOut before checkedIn', async() => {
        const visit = await factory.create('checkedInVisit')
        const earlyCheckOut = new Date(visit.checkedIn)
        earlyCheckOut.setHours(earlyCheckOut.getHours()-1)
        visit.checkedOut = earlyCheckOut
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not accept a checkedOut without a checkedIn', async () => {
        const visit = await factory.create('visit')
        visit.checkedOut = new Date()
        await visit.save().should.eventually.be.rejectedWith(ValidationError)
    })
    describe('searchPipeline', () => {
        const getVisits = async (params) => {
            return Visit.aggregate(Visit.searchPipeline(params))
        }
        it('should return all cancelled and uncancelled visits with cancelled=null',async () => {
            cancelled = await factory.create('visit',{cancelled: Date.now()})
            uncancelled = await factory.create('visit')
            const visits = await getVisits({})
            visits.map(v => v._id.toString()).should.have.members([cancelled,uncancelled].map(v => v.id))
            const cVisits = await getVisits({cancelled: true})
            cVisits.map(v => v._id.toString()).should.have.members([cancelled].map(v => v.id))
            const uVisits = await getVisits({cancelled: false})
            uVisits.map(v => v._id.toString()).should.have.members([uncancelled].map(v => v.id))
        })
    })
})