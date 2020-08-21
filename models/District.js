const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const PolygonSchema = require('./schemas/PolygonSchema')
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')

const DistrictSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        boundaries: {
            type: PolygonSchema,
            required: true
        },
    },
    {
        timestamps: true
    }
)

useHandleMongoError11000(DistrictSchema)

module.exports = District = mongoose.model('district',DistrictSchema)