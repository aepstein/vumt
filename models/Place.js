const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const PointSchema = require('./schemas/PointSchema')

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
        default: true
    },
    // Number of parking spots
    parkingCapacity: {
        type: Number,
        default: 0,
        required: true
    }
},
{
    timestamps: true
})

module.exports = Place = mongoose.model('place',PlaceSchema)