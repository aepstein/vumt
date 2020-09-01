const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema

const AdvisorySchema = new Schema(
    {
        label: {
            type: String,
            required: true
        },
        prompt: {
            type: String
        },
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

module.exports = Advisory = mongoose.model('advisory',AdvisorySchema)