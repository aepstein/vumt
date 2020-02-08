const { chai, factory, server } = require('../setup')
const { withAuth } = require('../support/patterns')
const { validPlace } = require('../support/validProps')
const { 
    errorMustHaveRoles,
    errorNoToken,
    errorPathRequired
} = require('../support/middlewareErrors')

describe('/api/places',() => {
    const genPlaces = async () => {
        return {
            origin: await factory.create('originPlace'),
            destination: await factory.create('destinationPlace')
        }
    }
    const action = async (path) => {
        const req = chai.request(server).get(path);
        return req;
    };
    describe('GET /api/places', () => {
        it('should show all places',async () => {
            const places = await genPlaces()
            const res = await action('/api/places')
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body.map(place => place._id).should.have.members([places.origin.id,places.destination.id])
        })
    })
    describe('GET /api/places/origins', () => {
        it('should show all places that are origins',async () => {
            const places = await genPlaces()
            const res = await action('/api/places/origins')
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body.map(place => place._id).should.have.members([places.origin.id])
        })
    })
    describe('GET /api/places/destinations', () => {
        it('should show all places that are destinations',async () => {
            const places = await genPlaces()
            const res = await action('/api/places/destinations')
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body.map(place => place._id).should.have.members([places.destination.id])
        })
    })
    describe('POST /api/places', () => {
        const action = async (place,auth) => {
            const res = chai.request(server).post('/api/places').send(place)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save a place for authorized user with valid attributes', async () => {
            const auth = await withAuth({roles:['admin']})
            const place = await validPlace()
            const res = await action(place,auth)
            res.should.have.status(201)
            res.body.should.be.an('object')
        })
        it('should return an error for an invalid submission', async () => {
            const auth = await withAuth({roles:['admin']})
            const place = await validPlace({name: null})
            const res = await action(place,auth)
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