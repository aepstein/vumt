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
    it('should save with a district restriction', async () => {
        await factory.create('advisory',{
            districts: [
                await factory.create('district')
            ]
        })
    })
    it('should save with a valid translation', async () => {
        await factory.create('advisory',{
            translations: [
                {language: 'en', translation: 'The English version.'}
            ]
        })
    })
    it('should not save with a translation missing translation', async () => {
        const advisory = await factory.build('advisory',{
            translations: [
                {language: 'en'}
            ]
        })
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with a translation missing language', async () => {
        const advisory = await factory.build('advisory',{
            translations: [
                {translation: 'The English version.'}
            ]
        })
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with a translation to invalid language code', async () => {
        const advisory = await factory.build('advisory',{
            translations: [
                {language: 'zz', translation: 'The English version.'}
            ]
        })
        await advisory.save().should.eventually.be.rejectedWith(ValidationError)
    })
})