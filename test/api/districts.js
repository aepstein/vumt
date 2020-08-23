const { chai, factory, server } = require('../setup')
const { withAuth } = require('../support/patterns')
const validDistrict = async (attrs={}) => {
    return factory.attrs('district',attrs)
}
const { 
    errorMustHaveRoles,
    errorNoToken,
    errorPathRequired,
} = require('../support/middlewareErrors')

describe.only('/api/districts',() => {
    const genDistricts = async () => {
        return {
            mcintyre: await factory.create('district')
        }
    }
    const action = async (path) => {
        const req = chai.request(server).get(path);
        return req;
    }
    describe('GET /api/districts', () => {
        it('should return all districts', async () => {
            const districts = await genDistricts()
            const res = await action('/api/districts')
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body.map(district => district._id).should.have.members([districts.mcintyre.id])
        })
    })
    describe('POST /api/districts', () => {
        const action = async (district,auth) => {
            const res = chai.request(server).post('/api/districts').send(district)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save an advisory for authorized user with valid attributes', async () => {
            const auth = await withAuth({roles:['admin']})
            const district = await validDistrict()
            const res = await action(district,auth)
            res.should.have.status(201)
            res.body.should.be.an('object')
            res.body.name.should.be.a('string').eql(district.name)
            res.body.boundaries.coordinates[0][0].should.have.deep.members(district.boundaries.coordinates[0][0])
        })
        it('should return an error for an invalid submission', async () => {
            const auth = await withAuth({roles:['admin']})
            const district = await validDistrict({name: null})
            const res = await action(district,auth)
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
    describe('PUT /api/districts/:districtId', async () => {
        const action = async (district,props,auth) => {
            const res = chai.request(server).put('/api/districts/' + district._id).send(props)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save for authorized user with valid attributes', async () => {
            const district = await factory.create('district')
            const auth = await withAuth({roles: ['admin']})
            attr = {
                name: 'Different District',
                boundaries: {
                    "type": "Polygon",
                    "coordinates": [[
                        [
                        -73.97506713867186,
                        44.171123644193784
                        ],
                        [
                        -74.02347564697266,
                        44.13639184602692
                        ],
                        [
                        -73.95515441894531,
                        44.169892369723506
                        ],
                        [
                        -73.97506713867186,
                        44.171123644193784
                        ]
                    ]]
                }
            }
            const res = await action(district,attr,auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.a.property('name').eql(attr.name)
            res.body.boundaries.coordinates[0][0].should.have.deep.members(attr.boundaries.coordinates[0][0])
        })
        it('should return an error for an invalid submission', async () => {
            const district = await factory.create('district')
            const auth = await withAuth({roles: ['admin']})
            const attr = await validDistrict({name: null})
            const res = await action(district,attr,auth)
            errorPathRequired(res,'name')
        })
        it('should deny an unprivileged user', async () => {
            const district = await factory.create('district')
            const auth = await withAuth()
            const res = await action(district,{},auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const district = await factory.create('district')
            const res = await action(district,{})
            await errorNoToken(res)
        })
    })
    describe('DELETE /api/districts/:districtId', () => {
        const action = async (district,auth) => {
            const res = chai.request(server).delete('/api/districts/' + district._id)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should delete for authorized user', async () => {
            const auth = await withAuth({roles:['admin']})
            const district = await factory.create('district')
            const res = await action(district,auth)
            res.should.have.status('200')
        })
        it('should deny an unprivileged user', async () => {
            const district = await factory.create('district')
            const auth = await withAuth()
            const res = await action(district,auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const district = await factory.create('district')
            const res = await action(district)
            await errorNoToken(res)
        })
    })
})