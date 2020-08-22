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
    })
})