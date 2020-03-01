const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const PointSchema = require('./schemas/PointSchema')
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')

const PlaceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // Location of the place
    location: {
        type: PointSchema,
        required: true
    },
    // Visits can originate from this place
    isOrigin: {
        type: Boolean,
        default: false
    },
    // Visits may list this place as a destination
    isDestination: {
        type: Boolean,
        default: false
    },
    // Number of parking spots
    parkingCapacity: {
        type: Number,
        default: 0,
        required: true
    },
    timezone: {
        type: String,
        default: 'America/New_York',
        required: true,
        enum: require('../lib/timezones.json')
    }
},
{
    timestamps: true
})

useHandleMongoError11000(PlaceSchema)

module.exports = Place = mongoose.model('place',PlaceSchema)