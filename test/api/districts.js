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
const { times } = require('../support/util')

describe('/api/districts',() => {
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
            res.body.data.should.be.an('array')
            res.body.data.map(district => district._id).should.have.members([districts.mcintyre.id])
            res.body.links.should.have.property('next').null
        })
        it('should paginate for more than 10 districts', async () => {
            const districts = await times(11,async () => factory.create('district'))
            const res = await action('/api/districts')
            res.should.have.a.status(200)
            res.body.data.should.be.an('array')
            res.body.data.map(d => d._id).should.have.members(districts.slice(0,10).map(d => d.id))
            res.body.links.should.have.property('next')
            const res2 = await action(res.body.links.next)
            res2.body.data.should.be.an('array')
            res2.body.data.map(d => d._id).should.have.members(districts.slice(10,11).map(d => d.id))
            res2.body.links.should.have.property('next').null
        })
        it('should filter for q=', async () => {
            const q = "needle"
            const districtCreates = []
            districtCreates.push(factory.create('district',{name: 'Haystack'}))
            districtCreates.push(factory.create('district',{name: 'Weaver\'s Needle'}))
            districtCreates.push(factory.create('district',{name: 'needle in the haystack'}))
            const districts = await Promise.all(districtCreates)
            const res = await action('/api/districts?q=needle')
            res.should.have.status(200)
            res.body.data.map(d => d._id).should.have
                .members(districts.filter(d => d.name.match(/needle/i)).map(d => d.id))
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
                    "type": "MultiPolygon",
                    "coordinates": [[[
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
                    ]]]
                }
            }
            const res = await action(district,attr,auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.a.property('name').eql(attr.name)
            res.body.boundaries.coordinates[0][0][0].should.have.deep.members(attr.boundaries.coordinates[0][0][0])
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