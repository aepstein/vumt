const { factory } = require('./setup')
const { Advisory, District, Place, User, Visit } = require('../../models')
const { 
    toLocalDate,
    fromLocalDateTimeToDate
} = require('./util')
const moment = require('moment')

factory.define('advisory', Advisory, {
    label: factory.sequence('Advisory.label', (n) => `Advisory ${n}`)
})

factory.extend('advisory','currentAdvisory', {
    startOn: () => moment().subtract(1,'days'),
    endOn: () => moment().add(1,'days')
})

factory.extend('advisory','pastAdvisory', {
    startOn: () => moment().subtract(2,'days'),
    endOn: () => moment().subtract(1,'days')
})

factory.extend('advisory','futureAdvisory', {
    startOn: () => moment().add(1,'days'),
    endOn: () => moment().add(2,'days')
})

factory.define('district', District, {
    name: factory.sequence('District.label', (n) => `District ${n}`),
    boundaries: {
        "type": "Polygon",
        "coordinates": [[
            [
            -73.97506713867186,
            44.171123644193784
            ],
            [
            -74.02347564697266,
            44.13639184602692
            ],
            [
            -74.05265808105469,
            44.10558415185072
            ],
            [
            -74.03205871582031,
            44.07130713213532
            ],
            [
            -73.96408081054688,
            44.14230508499824
            ],
            [
            -73.95515441894531,
            44.169892369723506
            ],
            [
            -73.97506713867186,
            44.171123644193784
            ]
        ]]
    }
})

factory.define('place', Place, {
    name: factory.sequence('Place.name', (n) => `Place ${n}`),
    location: {
        type: 'Point',
        coordinates: [-73.0,44.0]
    }
})

factory.extend('place','originPlace',{
    location: {
        type: 'Point',
        coordinates: [-73.963584,44.183102]
    },
    isOrigin: true,
    parkingCapacity: 100
})

factory.extend('place','destinationPlace',{
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
    country: 'US',
    distanceUnitOfMeasure: 'mi'
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

factory.extend('visit','futureVisit',{
    startOn: () => {
        d = new Date()
        d.setDate(d.getDate() + 1)
        return d
    }
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

