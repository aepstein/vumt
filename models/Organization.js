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

OrganizationSchema.methods.usersPipeline = function ({q}) {
    const c = []
    c.push({$unwind: {path: "$memberships"}})
    c.push({$match: {'memberships.organization': mongoose.Types.ObjectId(this._id)}})
    if (q) {
        const qc = new RegExp(q,'i')
        c.push({$match: {name: qc}})
    }
    c.push({$project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        roles: "$memberships.roles"
    }})
    c.push({$sort: { lastName: 1, firstName: 1, _id: 1 }})
    return c
}

useHandleMongoError11000(OrganizationSchema)

module.exports = Organization = mongoose.model('organization',OrganizationSchema)