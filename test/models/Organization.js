const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')
const {User} = require('../../models')

describe("Organization",() => {
    it('creates a valid organization', async () => {
        return factory.create('organization')
    })
    it('does not save without a name', async () => {
        const organization = await factory.build('organization', {name: null})
        return organization.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it('does not save with a duplicate name', async () => {
        const organization = await factory.create('organization')
        const duplicate = await factory.build('organization',{name: organization.name})
        return duplicate.save().should.eventually.be.rejectedWith(ValidationError)
    })
    describe('on delete',() => {
        it('should delete related memberships', async () => {
            const organization = await factory.create('organization')
            const other = await factory.create('organization')
            const user = await factory.create('user',{memberships:[
                {organization,roles:['admin']},
                {organization: other,roles:['ranger']}
            ]})
            await organization.deleteOne()
            userAfter = await User.findOne({_id: user.id})
            userAfter.memberships.map(m => m.organization._id.toString()).should.have.members([other.id])
        })
    })
})