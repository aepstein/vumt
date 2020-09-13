const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const TranslationSchema = require('./schemas/TranslationSchema')

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