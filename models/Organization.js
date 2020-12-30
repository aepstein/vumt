const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')
const User = require('./User')

const OrganizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

OrganizationSchema.pre('remove',async function () {
    await User.updateMany(
        {'memberships.organization': this.id},
        {$pull: {'memberships': { organization: this.id }}},
        {multi: true}
    )
})

useHandleMongoError11000(OrganizationSchema)

module.exports = Organization = mongoose.model('organization',OrganizationSchema)