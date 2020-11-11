const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const TranslationSchema = require('./schemas/TranslationSchema')
const AdvisoryContexts = require('./enums/AdvisoryContexts')

const AdvisorySchema = new Schema(
    {
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
            enum: Object.values(AdvisoryContexts)
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

// Populate districts on load
AdvisorySchema.post('find', async function(advisories) {
    for (let advisory of advisories) {
        await advisory.populate('districts').execPopulate()
    }
})

// After save, populate
AdvisorySchema.post('save', async function(advisory) {
    await advisory.populate('districts').execPopulate()
})

module.exports = Advisory = mongoose.model('advisory',AdvisorySchema)