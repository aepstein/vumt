const { factory } = require('../setup')

const Place = require('../../models/Place')

factory.define('place', Place, {
    name: "Marcy",
    location: {
        type: 'Point',
        coordinates: [44.0,73.0]
    }
})

factory.extend('place','originPlace',{
    name: 'Adirondack Loj',
    isOrigin: true
})

factory.extend('place','destinationPlace',{
    name: 'Algonquin Summit',
    isDestination: true
})