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
})