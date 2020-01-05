const { factory } = require('./setup')
const Place = require('../../models/Place')
const User = require('../../models/User')
const Visit = require('../../models/Visit')

factory.define('place', Place, {
    name: "Algonquin",
    location: {
        type: 'Point',
        coordinates: [44.0,73.0]
    }
})

factory.extend('place','originPlace',{
    name: "Adirondack Loj",
    location: {
        type: 'Point',
        coordinates: [44.183102,-73.963584]
    },
    isOrigin: true,
    parkingCapacity: 100
})

factory.extend('place','destinationPlace',{
    name: "Marcy Summit",
    location: {
        type: 'Point',
        coordinates: [44.112744,-73.923267]
    },
    isOrigin: false,
    parkingCapacity: 0
})

factory.define('user', User, {
    firstName: 'Bob',
    lastName: 'Marshall',
    email: factory.sequence('User.email', (n) => `bmarshall${n}@example.com`),
    password: 'noneofyourbusiness'
})

factory.define('visit', Visit, {
    name: 'Marcy',
    userId: factory.assoc('user','_id'),
    originPlaceId: factory.assoc('originPlace','_id')
})