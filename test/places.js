const { 
    Place
} = require('../models')
const chai = require('chai')
should = chai.should()
const server = require('../server')

const {
    withPlace
} = require('./support/patterns')
const {
    validPlaceDestination,
    validPlaceOrigin
} = require('./support/factories')

describe('Place',() => {
    const genPlaces = async () => {
        return {
            origin: await withPlace(validPlaceOrigin()),
            destination: await withPlace(validPlaceDestination())
        }
    }
    const action = async (path) => {
        const req = chai.request(server).get(path);
        return req;
    };
    beforeEach(async () => {
        await Place.deleteMany({})
    })
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
        it('should show all places',async () => {
            const places = await genPlaces()
            const res = await action('/api/places/origins')
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body.map(place => place._id).should.have.members([places.origin.id])
        })
    })
})