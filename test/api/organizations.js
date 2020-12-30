const { chai, factory, server } = require('../setup')
const { withAuth } = require('../support/patterns')
const validOrganization = async (attrs={}) => {
    return factory.attrs('organization',attrs)
}
const { 
    errorMustHaveRoles,
    errorNoToken,
    errorPathRequired,
} = require('../support/middlewareErrors')
const { times } = require('../support/util')

describe('/api/organizations',() => {
    const genOrganizations = async () => {
        return {
            mcintyre: await factory.create('organization')
        }
    }
    const action = async (path) => {
        const req = chai.request(server).get(path);
        return req;
    }
    describe('GET /api/organizations', () => {
        it('should return all organizations', async () => {
            const organizations = await genOrganizations()
            const res = await action('/api/organizations')
            res.should.have.status(200)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(organization => organization._id).should.have.members([organizations.mcintyre.id])
            res.body.links.should.have.property('next').null
        })
        it('should paginate for more than 10 organizations', async () => {
            const organizations = await times(11,async () => factory.create('organization'))
            const res = await action('/api/organizations')
            res.should.have.a.status(200)
            res.body.data.should.be.an('array')
            res.body.data.map(d => d._id).should.have.members(organizations.slice(0,10).map(d => d.id))
            res.body.links.should.have.property('next')
            const res2 = await action(res.body.links.next)
            res2.body.data.should.be.an('array')
            res2.body.data.map(d => d._id).should.have.members(organizations.slice(10,11).map(d => d.id))
            res2.body.links.should.have.property('next').null
        })
        it('should filter for q=', async () => {
            const q = "needle"
            const organizationCreates = []
            organizationCreates.push(factory.create('organization',{name: 'Haystack'}))
            organizationCreates.push(factory.create('organization',{name: 'Weaver\'s Needle'}))
            organizationCreates.push(factory.create('organization',{name: 'needle in the haystack'}))
            const organizations = await Promise.all(organizationCreates)
            const res = await action('/api/organizations?q=needle')
            res.should.have.status(200)
            res.body.data.map(d => d._id).should.have
                .members(organizations.filter(d => d.name.match(/needle/i)).map(d => d.id))
        })
    })
    describe('POST /api/organizations', () => {
        const action = async (organization,auth) => {
            const res = chai.request(server).post('/api/organizations').send(organization)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save an organization for authorized user with valid attributes', async () => {
            const auth = await withAuth({roles:['admin']})
            const organization = await validOrganization()
            const res = await action(organization,auth)
            res.should.have.status(201)
            res.body.should.be.an('object')
            res.body.name.should.be.a('string').eql(organization.name)
        })
        it('should return an error for an invalid submission', async () => {
            const auth = await withAuth({roles:['admin']})
            const organization = await validOrganization({name: null})
            const res = await action(organization,auth)
            errorPathRequired(res,'name')
        })
        it('should deny an unprivileged user', async () => {
            const auth = await withAuth()
            const res = await action({},auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const res = await action({})
            await errorNoToken(res)
        })
    })
    describe('PUT /api/organizations/:organizationId', async () => {
        const action = async (organization,props,auth) => {
            const res = chai.request(server).put('/api/organizations/' + organization._id).send(props)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save for authorized user with valid attributes', async () => {
            const organization = await factory.create('organization')
            const auth = await withAuth({roles: ['admin']})
            attr = {
                name: 'Different Organization'
            }
            const res = await action(organization,attr,auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.a.property('name').eql(attr.name)
        })
        it('should return an error for an invalid submission', async () => {
            const organization = await factory.create('organization')
            const auth = await withAuth({roles: ['admin']})
            const attr = await validOrganization({name: null})
            const res = await action(organization,attr,auth)
            errorPathRequired(res,'name')
        })
        it('should deny an unprivileged user', async () => {
            const organization = await factory.create('organization')
            const auth = await withAuth()
            const res = await action(organization,{},auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const organization = await factory.create('organization')
            const res = await action(organization,{})
            await errorNoToken(res)
        })
    })
    describe('DELETE /api/organizations/:organizationId', () => {
        const action = async (organization,auth) => {
            const res = chai.request(server).delete('/api/organizations/' + organization._id)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should delete for authorized user', async () => {
            const auth = await withAuth({roles:['admin']})
            const organization = await factory.create('organization')
            const res = await action(organization,auth)
            res.should.have.status('200')
        })
        it('should deny an unprivileged user', async () => {
            const organization = await factory.create('organization')
            const auth = await withAuth()
            const res = await action(organization,auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const organization = await factory.create('organization')
            const res = await action(organization)
            await errorNoToken(res)
        })
    })
})