const { chai, factory, server } = require('../setup')
const { withAuth } = require('../support/patterns')
const { validPlace } = require('../support/validProps')
const { 
    errorMustHaveRoles,
    errorNoToken,
    errorPathRequired,
    errorPathUnique
} = require('../support/middlewareErrors')
const { times } = require('../support/util')

describe('/api/places',() => {
    const genPlaces = async () => {
        return {
            origin: await factory.create('originPlace'),
            destination: await factory.create('destinationPlace')
        }
    }
    const action = async (path,options={}) => {
        const req = chai.request(server).get(path,options);
        return req;
    };
    describe('GET /api/places', () => {
        it('should show all places',async () => {
            const places = await genPlaces()
            const res = await action('/api/places')
            res.should.have.status(200)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(place => place._id).should.have.members([places.origin.id,places.destination.id])
        })
        it('should order places by distance and include distance from location if location is specified',async () => {
            const places = await genPlaces()
            const location = '44.112744,-73.923267'
            const res = await action(`/api/places?location=${location}`)
            res.body.data.should.be.an('array')
            res.body.data[0].should.have.property('_id').eql(places.destination.id)
            res.body.data[0].should.have.property('distance').eql(0)
            res.body.data[1].should.have.property('distance').gt(8000)
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
            await factory.create('visit',{
                origin: places.origin._id,
                durationNights: 0,
                parkedVehicles: 2,
                groupSize: 4,
                startOn: justBefore,
                cancelled: Date.now()
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
            res.body.should.have.property('data').be.an('array')
            res.body.data[0].name.should.be.a('String').eql(places.origin.name)
            const visits = res.body.data[0].visits[0]
            visits.should.be.an('object')
            visits.should.have.a.property('people').eql(7)
            visits.should.have.a.property('parties').eql(2)
            visits.should.have.a.property('parkedVehicles').eql(3)
        })
        it('should paginate',async () => {
            const places = await times(11,async () => factory.create('place'))
            const res = await action('/api/places')
            res.should.have.status(200)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(p => p._id).should.have.members(places.slice(0,10).map(p => p.id))
            res.body.should.have.property('links').be.an('object')
            res.body.links.should.have.property('next').match(/after/i)
            res2 = await action(res.body.links.next)
            res2.body.should.have.property('data').be.an('array')
            res2.body.data.map(p => p._id).should.have.members(places.slice(10,11).map(p => p.id))
        })
        it('should filter and paginate with q=',async () => {
            var i = 0
            const places = await times(11,async () => {
                return factory.create('place',{name: `needle ${(i++).toString().padStart(2,'0')}`})
            })
            places.push(await factory.create('place',{name: 'haystack'}))
            const res = await action('/api/places?q=needle')
            res.should.have.status(200)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(p => p._id).should.have.members(places.slice(0,10).map(p => p.id))
            res.body.should.have.property('links').be.an('object')
            res.body.links.should.have.property('next').be.a('string')
            const res2 = await action(res.body.links.next)
            res2.should.have.status(200)
            res2.body.should.have.property('data').be.an('array')
            res2.body.data.map(p => p._id).should.have.members(places.slice(10,11).map(p => p.id))
            res2.body.should.have.property('links').be.an('object')
            res2.body.links.should.have.property('next').be.null
        })
    })
    describe('GET /api/places?type=origins', () => {
        it('should show all places that are origins',async () => {
            const places = await genPlaces()
            const res = await action('/api/places?type=origins')
            res.should.have.status(200)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(place => place._id).should.have.members([places.origin.id])
        })
    })
    describe('GET /api/places?type=destinations', () => {
        it('should show all places that are destinations',async () => {
            const places = await genPlaces()
            const res = await action('/api/places?type=destinations')
            res.should.have.status(200)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(place => place._id).should.have.members([places.destination.id])
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
        it('should return an error for unique key violation', async() => {
            const auth = await withAuth({roles:['admin']})
            await factory.create('place',{name: 'Lost Pond'})
            const place = await validPlace({name: 'Lost Pond'})
            const res = await action(place,auth)
            errorPathUnique(res,'name')
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
        it('should fail if there is a restricted dependency', async () => {
            const auth = await withAuth({roles:['admin']})
            const place = await factory.create('place')
            await factory.create('visit',{origin: place.id})
            const res = await action(place,auth)
            res.should.have.status('409')
            res.body.should.be.an('object')
            res.body.should.have.property('key').eq('origin')
            res.body.should.have.property('model').eq('place')
            res.body.should.have.property('dependent').eq('visit')
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