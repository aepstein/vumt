const { chai, factory, server } = require('../setup')

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
})