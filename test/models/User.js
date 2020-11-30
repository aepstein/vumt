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
    it('should save with valid role', async () => {
        const roles = ['ranger','planner','admin']
        const user = await factory.build('user',{roles})
        const savedUser = await user.save()
        savedUser.roles.should.have.members(roles)
    })
    it('should not save with invalid role', async () => {
        const user = await factory.build('user',{roles: ['producer']})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should save with an enableGeolocation flag', async () => {
        const user = await factory.create('user',{enableGeolocation: true})
        user.should.have.a.property('enableGeolocation').eql(true)
    })
    it('should not save without a distanceUnitOfMeasure', async () => {
        const user = await factory.build('user',{distanceUnitOfMeasure: null})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with an invalid distanceUnitOfMeasure', async () => {
        const user = await factory.build('user',{distanceUnitOfMeasure: 'paces'})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    describe('User.createResetPasswordToken',() => {
        it('should set token and expiration and send an email',async () => {
            const user = await factory.create('user')
            const email = await user.createResetPasswordToken('localhost')
            user.resetPasswordTokens[0].token.length.should.eql(40)
            email.envelope.should.have.a.property('to').have.members([user.email])
        })
    })
    describe('User.resetPasswordWithToken',() => {
        it('should reset password and expend valid token',async () => {
            const user = await factory.create('user')
            const preCompare = await user.comparePassword('swordfish')
            preCompare.should.eql(false)
            await user.createResetPasswordToken('localhost')
            await user.resetPasswordWithToken(user.resetPasswordTokens[0].token,'swordfish')
            user.comparePassword('swordfish').should.not.eql(false)
            user.resetPasswordTokens[0].expended.should.not.eql(null)
        })
    })
})