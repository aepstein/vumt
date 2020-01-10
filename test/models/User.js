const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe('User', () => {
    it('creates a valid user', () => {
        return factory.create('user')
    })
    it('should not save without a country', async () => {
        const user = await factory.build('user',{country: null})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('should not save with an invalid country', async () => {
        const user = await factory.build('user',{country: 'ZZ'})
        await user.save().should.eventually.be.rejectedWith(ValidationError)
    })
})