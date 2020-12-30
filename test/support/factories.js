const { factory } = require('./setup')
const { Advisory, District, Organization, Place, User, Visit } = require('../../models')
const { 
    toLocalDate,
    fromLocalDateTimeToDate
} = require('./util')
const moment = require('moment')

factory.define('advisory', Advisory, {
    label: factory.sequence('Advisory.label', (n) => `Advisory ${n.toString().padStart(3,'0')}`),
    prompt: 'Take note'
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

factory.extend('advisory','originAdvisory', {
    districts: factory.assocMany('originDistrict',1,'_id')
})

factory.extend('advisory','destinationAdvisory', {
    districts: factory.assocMany('destinationDistrict',1,'_id')
})

factory.extend('advisory','farawayAdvisory', {
    districts: factory.assocMany('farawayDistrict',1,'_id')
})

factory.define('district', District, {
    name: factory.sequence('District.label', (n) => `District ${n}`),
    boundaries: {
        "type": "Polygon",
        // These approximate the McIntyre Range in the Adirondacks
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

factory.extend('district','originDistrict',{
    // These boundaries approximate the vicinity of the Adirondak Loj
    boundaries: {
        type: 'Polygon',
        coordinates: [
            [
              [
                -73.9623212814331,
                44.187958743354216
              ],
              [
                -73.97691249847412,
                44.18602002805711
              ],
              [
                -73.97442340850829,
                44.17527900575857
              ],
              [
                -73.95584106445312,
                44.17709496072222
              ],
              [
                -73.9623212814331,
                44.187958743354216
              ]
            ]
          ]
    }
})

factory.extend('district','destinationDistrict',{
    // These boundaries approximate the vicinity of the Great Range summits
    boundaries: {
        type: 'Polygon',
        coordinates: [
            [
              [
                -73.93524169921875,
                44.112239974004645
              ],
              [
                -73.92974853515625,
                44.09892758020247
              ],
              [
                -73.88786315917969,
                44.10730980734024
              ],
              [
                -73.83190155029297,
                44.13540624862203
              ],
              [
                -73.8006591796875,
                44.156592967556605
              ],
              [
                -73.80168914794922,
                44.16742974366932
              ],
              [
                -73.82125854492188,
                44.16890733164003
              ],
              [
                -73.93524169921875,
                44.112239974004645
              ]
            ]
          ]
    }
})

factory.extend('district','farawayDistrict',{
    // These boundaries approximate the vicinity of the Kelly Adirondack Center
    boundaries: {
        type: 'Polygon',
        coordinates: [
            [
              [
                -73.88199716806412,
                42.7896297296502
              ],
              [
                -73.8829842209816,
                42.788858132945705
              ],
              [
                -73.8823351264,
                42.78851169864354
              ],
              [
                -73.88144463300705,
                42.78918685006471
              ],
              [
                -73.88199716806412,
                42.7896297296502
              ]
            ]
          ]
    }
})

factory.define('organization', Organization, {
  name: factory.sequence('Organization.name', (n) => `Organization ${n.toString().padStart(3,'0')}`)
})

factory.define('place', Place, {
    name: factory.sequence('Place.name', (n) => `Place ${n.toString().padStart(3,'0')}`),
    location: {
        type: 'Point',
        coordinates: [-73.0,44.0]
    }
})

factory.extend('place','originPlace',{
    location: {
        type: 'Point',
        // These coordinates approximate the location of the Adirondak Loj
        coordinates: [-73.963584,44.183102]
    },
    isOrigin: true,
    parkingCapacity: 100
})

factory.extend('place','destinationPlace',{
    location: {
        type: 'Point',
        // These coordinates approximate the location of Mount Marcy
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

