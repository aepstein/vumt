const { factory } = require('./setup')
const Place = require('../../models/Place')
const User = require('../../models/User')
const Visit = require('../../models/Visit')
const { toLocalDate } = require('./util')

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
    isDestination: true,
    parkingCapacity: 0
})

factory.define('user', User, {
    firstName: 'Bob',
    lastName: 'Marshall',
    email: factory.sequence('User.email', (n) => `bmarshall${n}@example.com`),
    password: 'noneofyourbusiness',
    country: 'US'
})

factory.define('visit', Visit, {
    user: factory.assoc('user','_id'),
    startOnDate: () => toLocalDate(new Date()),
    startOnTime: '08:00',
    origin: factory.assoc('originPlace','_id'),
    destinations: [],
    durationNights: 0,
    groupSize: 4
})