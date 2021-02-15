const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')
const moment = require('moment')
const Advisory = require('../../models/Advisory')
const { applicableAdvisories } = require('../support/applicableAdvisories')

describe("Advisory", () => {
    it('creates a valid advisory', async () => {
        await factory.create('advisory')
    })
    it('should not save without a label', async () => {
        let advisory = await factory.build('advisory',{label: null})
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save without a theme', async () => {
        let advisory = await factory.build('advisory',{theme: null})
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
    it('should save with a district restriction', async () => {
        await factory.create('advisory',{
            districts: [
                await factory.create('district')
            ]
        })
    })
    it('should save with a valid prompt', async () => {
        const advisory = await factory.create('advisory',{
            prompts: [
                {language: 'en-US', translation: 'The *English* version.'}
            ]
        })
        advisory.prompts[0].should.have.property('translationHTML').contain("The <strong>English</strong> version.")
    })
    it('should not save with a prompt missing translation', async () => {
        const advisory = await factory.build('advisory',{
            prompts: [
                {language: 'en-US'}
            ]
        })
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with a prompt missing language', async () => {
        const advisory = await factory.build('advisory',{
            prompts: [
                {translation: 'The English version.'}
            ]
        })
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with a prompt having an invalid language code', async () => {
        const advisory = await factory.build('advisory',{
            prompts: [
                {language: 'zz', translation: 'The English version.'}
            ]
        })
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should save with a valid context', async () => {
        await factory.create('advisory',{contexts: ['register']})
    })
    it('should not save with an invalid context', async () => {
        const advisory = await factory.build('advisory',{contexts: ['malarky']})
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should remove duplicate contexts on save', async () => {
        const advisory = await factory.create('advisory',{contexts: ['register','register']})
        advisory.contexts.length.should.eql(1)
    })
    describe('Advisory.applicable()', () => {
        it('should return applicable advisories with visit attributes', async() => {
            const collectAdvisories = (advisories,theme) => advisories
                .concat(theme.advisories.map(a => a._id.toString()))
            const { advisories, visit } = await applicableAdvisories()
            advisoriesControl = await visit.applicableAdvisories()
            const advisoriesControlIds = advisoriesControl.reduce(collectAdvisories,[])
            advisoriesControlIds.should.have.members(advisories)
            advisoriesTest = await Advisory.applicable({
                startOn: visit.startOn,
                endOn: visit.startOn,
                places: [visit.origin._id].concat(visit.destinations.map(d => d._id))
            })
            advisoriesTest.map(a => a._id.toString()).should.have.members(
                advisoriesControl.map(a => a._id.toString())
            )
            advisoriesTest.reduce(collectAdvisories,[]).should.have.members(advisoriesControlIds)
        })
    })
})