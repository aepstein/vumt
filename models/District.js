const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const MultiPolygonSchema = require('./schemas/MultiPolygonSchema')
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')

const DistrictSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        boundaries: {
            type: MultiPolygonSchema,
            required: true
        },
    },
    {
        timestamps: true
    }
)

useHandleMongoError11000(DistrictSchema)

module.exports = District = mongoose.model('district',DistrictSchema)