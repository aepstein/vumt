const { factory } = require('../setup')

const Place = require('../../models/Place')

factory.define('place', Place, {
    name: "Algonquin",
    location: {
        type: 'Point',
        coordinates: [44.0,73.0]
    }
})