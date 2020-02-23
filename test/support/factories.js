const { factory } = require('./setup')
const Place = require('../../models/Place')
const User = require('../../models/User')
const Visit = require('../../models/Visit')
const { 
    toLocalDate,
    fromLocalDateTimeToDate
} = require('./util')

factory.define('place', Place, {
    name: "Algonquin",
    location: {
        type: 'Point',
        coordinates: [-73.0,44.0]
    }
})

factory.extend('place','originPlace',{
    name: "Adirondack Loj",
    location: {
        type: 'Point',
        coordinates: [-73.963584,44.183102]
    },
    isOrigin: true,
    parkingCapacity: 100
})

factory.extend('place','destinationPlace',{
    name: "Marcy Summit",
    location: {
        type: 'Point',
        coordinates: [-73.923267,44.112744]
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
    startOn: () => new Date(),
    origin: factory.assoc('originPlace','_id'),
    destinations: [],
    durationNights: 0,
    groupSize: 4,
    parkedVehicles: 1
})

factory.extend('visit','checkedInVisit',{
    checkedIn: () => {
        return fromLocalDateTimeToDate(`${toLocalDate(new Date())} 08:05`)
    }
})

factory.extend('checkedInVisit','checkedOutVisit',{
    checkedOut: () => {
        return fromLocalDateTimeToDate(`${toLocalDate(new Date())} 12:05`)
    }
})

