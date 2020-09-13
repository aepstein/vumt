const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    // User responsible for the visit
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Start date
    startOn: {
        type: Date,
        required: true
    },
    // Starting place for the visit
    origin: {
        type: Schema.Types.ObjectId,
        ref: 'place',
        required: true
    },
    // Destinations that will be included in visit
    destinations: [{type: Schema.Types.ObjectId, ref: 'place'}],
    durationNights: {
        type: Number,
        required: true,
        min: 0
    },
    groupSize: {
        type: Number,
        required: true,
        min: 1
    },
    parkedVehicles: {
        type: Number,
        required: true,
        min: 0
    },
    checkedIn: {
        type: Date
    },
    checkedOut: {
        type: Date
    }
},
{
    timestamps: true
})

VisitSchema.pre('validate', function(next) {
    const { checkedIn, checkedOut, startOn, durationNights } = this
    if (checkedIn && startOn) {
        const startOnLeft = new Date(startOn)
        startOnLeft.setDate(startOnLeft.getDate()-1)
        if (checkedIn < startOnLeft) {
            this.invalidate('checkedIn','May be no earlier than one day before the scheduled start of the visit.')
        }
        const startOnRight = new Date(startOn)
        startOnRight.setDate(startOnRight.getDate() + durationNights + 1)
        if (checkedIn > startOnRight) {
            this.invalidate('checkedIn','May be no later than one day after the scheduled end of the visit.')
        }
    }
    if (checkedOut) {
        if (!checkedIn) {
            this.invalidate('checkedOut','May not be filled in unless visit is checked in.')
        }
        else if (checkedOut < checkedIn) {
            this.invalidate('checkedOut','May not be earlier than check in')
        }
    }
    next()
})

// Populate origin, destinations on load
VisitSchema.post('find', async function(visits) {
    for (let visit of visits) {
        await visit.populate('origin').populate('destinations').execPopulate()
    }
})

// Populate origin, destinations on load
VisitSchema.post('findOne', async function(visit) {
    await visit.populate('origin').populate('destinations').execPopulate()
})

// After save, populate
VisitSchema.post('save', async function(visit) {
    await visit.populate('origin').populate('destinations').execPopulate()
})

// Retrieve advisories that are applicable to this visit
VisitSchema.methods.applicableAdvisories = async function () {
    // Basic conditions - no geographic constraint or intersect with origin
    const geoConditions = [
        {"districts.boundaries": { $geoIntersects: {$geometry: this.origin.location}}},
        {districts: {$eq: null}}
    ]
    // Also include if intersecting with origin
    this.destinations.forEach(d => {
        geoConditions.push({
            "districts.boundaries": { $geoIntersects: {$geometry: d.location}}
        })
    })
    return mongoose.model('advisory').aggregate([
        {$lookup: {from: 'districts', localField: 'districts', foreignField: '_id', as: 'districts'}},
        {$unwind: {path: '$districts', preserveNullAndEmptyArrays: true}},
        {$match: {$and: [
            {$or: [{startOn: { $lte: this.startOn }}, {startOn: {$eq: null}}]},
            {$or: [{endOn: { $gte: this.startOn }}, {endOn: {$eq: null}}]},
            {$or: geoConditions}
        ]}},
        {$group: {
            _id: '$_id',
            label: {$first: '$label'},
            prompts: {$first: '$prompts'}
        }}
    ])
}

module.exports = Visit = mongoose.model('visit',VisitSchema);
