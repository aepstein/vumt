const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe('User', () => {
    it('creates a valid user', () => {
        return factory.create('user')
    })
    it('should not save with a duplicate email', async () => {
        const oUser = await factory.create('user')
        const user = await factory.build('user',{email: oUser.email})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with a duplicate email on update', async () => {
        const oUser = await factory.create('user')
        const user = await factory.create('user')
        user.email = oUser.email
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save without a country', async () => {
        const user = await factory.build('user',{country: null})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with an invalid country', async () => {
        const user = await factory.build('user',{country: 'ZZ'})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should save with a valid province', async () => {
        const user = await factory.build('user',{province: 'New York'})
        const savedUser = await user.save()
        savedUser.province.should.be.a('string').eql('New York')
    })
    it('should save with a valid postal code', async () => {
        const user = await factory.build('user',{postalCode: '12943'})
        const savedUser = await user.save()
        savedUser.postalCode.should.be.a('string').eql('12943')
    })
    it('should save with a valid phone', async () => {
        const user = await factory.build('user',{phone: '518 555 1212'})
        const savedUser = await user.save()
        savedUser.phone.should.be.a('string').eql('+15185551212')
    })
    it('should not save with an invalid phone', async () => {
        const user = await factory.build('user',{phone: '555-1212'})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
})