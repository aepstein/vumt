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
        }
    },
    {
        timestamps: true
    }
)

module.exports = Advisory = mongoose.model('advisory',AdvisorySchema)