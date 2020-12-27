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

PlaceSchema.statics.searchPipeline = ({location,q,startOn,type}) => {
    const c = []
    if (location) {
        const [ latitude, longitude ] = location.split(',').map(v => parseFloat(v))
        c.push({
            $geoNear: {
                near: { type: "Point", coordinates: [longitude,latitude] },
                spherical: true,
                distanceField: 'distance'
            }
        })
        c.push({$sort: { distance: 1, _id: 1 }})
    }
    else {
        c.push({$sort: { name: 1, _id: 1 }})
    }
    if (startOn) {
        c.push({$lookup: {from: 'visits', let: {originId: '$_id'}, as: 'visits', pipeline: [
            // Heuristic for end of trip -- 12 hours later or 24 hours * number of nights
            {$addFields: {endOn: {$add: [
                    "$startOn",
                    {$cond: {if: { $eq: ["$durationNights", 0]},
                        then: 1000*60*60*12,
                        else: {$multiply: ["$durationNights",1000*60*60*24]}}}
            ]}}},
            // Join conditions
            {$match: { $expr: {$and: [
                // Originating at place
                { $eq: ['$$originId','$origin'] },
                // Intersecting with arrival
               {$lte:["$startOn",startOn]},
               {$lte:[startOn,"$endOn"]}
            ]}}},
            // Count up visits, vehicles, and people
            {$group: {_id: null, parties: {$sum: 1}, parkedVehicles: {$sum: "$parkedVehicles"},
                people: {$sum: "$groupSize"}}}
        ]}})
    }
    if (q) {
        const qc = new RegExp(q,'i')
        c.push({$match: {name: qc}})
    }
    switch(type) {
        case 'origins':
            c.push({$match: {isOrigin: true}})
            break
        case 'destinations':
            c.push({$match: {isDestination: true}})
            break
    }
    return c
}

useHandleMongoError11000(PlaceSchema)

module.exports = Place = mongoose.model('place',PlaceSchema)