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
        it('should order places by distance and include distance from location if location is specified',async () => {
            const places = await genPlaces()
            const location = '44.112744,-73.923267'
            const res = await action(`/api/places?location=${location}`)
            res.body.should.be.an('array')
            res.body[0].should.have.property('_id').eql(places.destination.id)
            res.body[0].should.have.property('distance').eql(0)
            res.body[1].should.have.property('distance').gt(8000)
        })
        it('should compile information on intersecting visits', async () => {
            const places = await genPlaces()
            startOn = new Date()
            startOn.setDate(startOn.getDate()+1)
            justBefore = new Date(startOn)
            justBefore.setHours(justBefore.getHours()-1)
            await factory.create('visit',{
                origin: places.origin._id,
                durationNights: 0,
                parkedVehicles: 2,
                groupSize: 4,
                startOn: justBefore
            })
            justAfter = new Date(startOn)
            justAfter.setHours(justAfter.getHours()+1)
            await factory.create('visit',{
                origin: places.origin._id,
                durationNights: 0,
                parkedVehicles: 2,
                groupSize: 4,
                startOn: justAfter
            })
            overnight = new Date(startOn)
            overnight.setHours(overnight.getHours()-23)
            await factory.create('visit',{
                origin: places.origin._id,
                durationNights: 1,
                parkedVehicles: 1,
                groupSize: 3,
                startOn: overnight
            })
            const res = await action(`/api/places?startOn=${startOn.toISOString()}`)
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body[0].name.should.be.a('String').eql('Adirondack Loj')
            const visits = res.body[0].visits[0]
            visits.should.be.an('object')
            visits.should.have.a.property('people').eql(7)
            visits.should.have.a.property('parties').eql(2)
            visits.should.have.a.property('parkedVehicles').eql(3)
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
    describe('PUT /api/places/:placeId', async () => {
        const action = async (place,props,auth) => {
            const res = chai.request(server).put('/api/places/' + place._id).send(props)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save for authorized user with valid attributes', async () => {
            const place = await factory.create('place')
            const auth = await withAuth({roles: ['admin']})
            attr = {
                name: 'Cascade Lake',
                location: {
                    type: 'Point',
                    coordinates: [44.1,73.2]
                },
                isOrigin: true,
                isDestination: true,
                parkingCapacity: 15,
                timezone: 'America/Chicago'
            }
            const res = await action(place,attr,auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.a.property('name').eql(attr.name)
            res.body.should.have.a.property('location').deep.include(attr.location)
            res.body.should.have.a.property('isOrigin').eql(attr.isOrigin)
            res.body.should.have.a.property('isDestination').eql(attr.isDestination)
            res.body.should.have.a.property('parkingCapacity').eql(attr.parkingCapacity)
            res.body.should.have.a.property('timezone').eql(attr.timezone)
        })
        it('should return an error for an invalid submission', async () => {
            const place = await factory.create('place')
            const auth = await withAuth({roles: ['admin']})
            const attr = await validPlace({name: null})
            const res = await action(place,attr,auth)
            errorPathRequired(res,'name')
        })
        it('should deny an unprivileged user', async () => {
            const place = await factory.create('place')
            const auth = await withAuth()
            const res = await action(place,{},auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const place = await factory.create('place')
            const res = await action(place,{})
            await errorNoToken(res)
        })
    })
    describe('DELETE /api/places/:placeId', () => {
        const action = async (place,auth) => {
            const res = chai.request(server).delete('/api/places/' + place._id)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should delete for authorized user', async () => {
            const auth = await withAuth({roles:['admin']})
            const place = await factory.create('place')
            const res = await action(place,auth)
            res.should.have.status('200')
        })
        it('should deny an unprivileged user', async () => {
            const place = await factory.create('place')
            const auth = await withAuth()
            const res = await action(place,auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const place = await factory.create('place')
            const res = await action(place)
            await errorNoToken(res)
        })
    })
})