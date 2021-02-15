const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const TranslationSchema = require('./schemas/TranslationSchema')
const advisoryContexts = require('../lib/advisoryContexts')
const Place = require('./Place')

const AdvisorySchema = new Schema(
    {
        theme: {
            type: Schema.Types.ObjectId,
            ref: 'theme',
            required: true
        },
        label: {
            type: String,
            required: true
        },
        prompts: [TranslationSchema],
        startOn: {
            type: Date
        },
        endOn: {
            type: Date
        },
        districts: [{
            type: Schema.Types.ObjectId,
            ref: 'district'
        }],
        contexts: [{
            type: String,
            enum: Object.values(advisoryContexts)
        }]
    },
    {
        timestamps: true
    }
)

AdvisorySchema.pre('validate', function (next) {
    if (this.startOn && this.endOn && this.startOn > this.endOn) {
        this.invalidate('startOn', 'Cannot be after endOn')
    }
    next()
})

AdvisorySchema.pre('save', function (next) {
    if (this.contexts) {
        this.contexts = [...new Set(this.contexts)]
    }
    next()
})

const populate = (advisory) => {
    return advisory.populate('districts','name').populate('theme')
}

AdvisorySchema.pre('find',function () {
    populate(this)
})

AdvisorySchema.pre('findOne',function () {
    populate(this)
})

AdvisorySchema.post('save', async function(advisory) {
    await populate(advisory).execPopulate()
})

// Retrieve advisories that are applicable to a context
AdvisorySchema.statics.applicable = async function ({context,visit,startOn,endOn,places}) {
    const contextConditions = [{contexts: {$size: 0}}]
    const startOnConditions = [{startOn: {$eq: null}}]
    const endOnConditions = [{endOn: {$eq: null}}]
    const geoConditions = [{districts: {$eq: null}}]
    if (visit) {
        startOnConditions.push({startOn: { $lte: visit.startOn }})
        endOnConditions.push({endOn: { $gte: visit.startOn }})
        // Intersect with visit origin
        geoConditions.push({"districts.boundaries": { $geoIntersects: {$geometry: visit.origin.location}}})
        // Also include if intersecting with any visit destination
        visit.destinations.forEach(d => {
            geoConditions.push({
                "districts.boundaries": { $geoIntersects: {$geometry: d.location}}
            })
        })
    }
    if (context) {
        contextConditions.push({contexts: {$elemMatch: { $eq: context}}})
    }
    if (startOn) {
        startOnConditions.push({startOn: { $lte: startOn }})
    }
    if (endOn) {
        endOnConditions.push({endOn: { $gte: endOn }})
    }
    if (places) {
        const placeRecords = await Place.find({_id: {$in: places}},['location'])
        placeRecords.forEach((place) => {
            const {coordinates,type} = place.location
            geoConditions.push({
                "districts.boundaries": { $geoIntersects: { $geometry: {coordinates,type} } }
            })
        })
    }
    const pipeline = [
        {$lookup: {from: 'themes', localField: 'theme', foreignField: '_id', as: 'theme'}},
        {$unwind: {path: '$theme'}},
        {$lookup: {from: 'districts', localField: 'districts', foreignField: '_id', as: 'districts'}},
        {$unwind: {path: '$districts', preserveNullAndEmptyArrays: true}},
        {$match: {$and: [
            {$or: contextConditions},
            {$or: startOnConditions},
            {$or: endOnConditions},
            {$or: geoConditions}
        ]}},
        {$sort: {
            "theme.name": 1,
            label: 1
        }},
        {$group: {
            _id: '$_id',
            theme: {$first: '$theme'},
            label: {$first: '$label'},
            prompts: {$first: '$prompts'}
        }},
        {$replaceRoot: {newRoot: {$mergeObjects: [
            {advisory: {_id: '$_id', label: '$label', prompts: '$prompts'}},
            '$theme'
        ]}}},
        {$group: {
            _id: '$_id',
            name: {$first: '$name'},
            color: {$first: '$color'},
            labels: {$first: '$labels'},
            advisories: {$push: '$advisory'}
        }}
    ]
    return mongoose.model('advisory').aggregate(pipeline)
}

module.exports = Advisory = mongoose.model('advisory',AdvisorySchema)