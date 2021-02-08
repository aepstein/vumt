const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const Advisory = require('./Advisory')
const Organization = require('./Organization')
const MultiPolygonSchema = require('./schemas/MultiPolygonSchema')
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')
const { RestrictedKeyError } = require('../lib/errors/models')

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

DistrictSchema.pre('deleteOne',{document: true},async function() {
    const advisory = await Advisory.findOne({districts: this.id})
    if (advisory) {
        throw new RestrictedKeyError(this, advisory, 'districts')
    }
    await Organization.updateMany(
        {districts: this.id},
        {$pull: {districts: this.id }},
        {multi: true}
    )
    return true
})

useHandleMongoError11000(DistrictSchema)

module.exports = District = mongoose.model('district',DistrictSchema)