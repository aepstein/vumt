const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')
const User = require('./User')

const OrganizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true
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

OrganizationSchema.pre('deleteOne',{document: true}, async function () {
    await User.updateMany(
        {'memberships.organization': this.id},
        {$pull: {memberships: { organization: this.id }}},
        {multi: true}
    )
})

const populate = (organization) => {
    return organization.populate('districts','name')
}

OrganizationSchema.pre('find',function () {
    populate(this)
})

OrganizationSchema.pre('findOne', function () {
    populate(this)
})

OrganizationSchema.post('save', async function (organization) {
    await populate(organization).execPopulate()
})

OrganizationSchema.methods.usersPipeline = function ({q}) {
    const c = []
    c.push({$unwind: {path: "$memberships"}})
    c.push({$match: {'memberships.organization': mongoose.Types.ObjectId(this._id)}})
    if (q) {
        const qc = new RegExp(q,'i')
        c.push({$match: {$or: [
            {firstName: qc},
            {lastName: qc},
            {email: qc},
            {'memberships.roles': qc}
        ]}})
    }
    c.push({$sort: { lastName: 1, firstName: 1, _id: 1 }})
    c.push({$project: {
        // We need these attributes at root level for sorting/pagination to work
        _id: "$_id",
        firstName: "$firstName",
        lastName: "$lastName",
        organization: { $literal: this._id },
        user: {
            _id: "$_id",
            firstName: "$firstName",
            lastName: "$lastName",
            email: "$email"
        },
        roles: "$memberships.roles"
    }})
    return c
}

useHandleMongoError11000(OrganizationSchema)

module.exports = Organization = mongoose.model('organization',OrganizationSchema)