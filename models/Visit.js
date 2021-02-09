const mongoose = require('../db/mongoose');
const {ObjectId} = require('mongoose').Types
const Schema = mongoose.Schema;
const Advisory = require('./Advisory')

const VisitSchema = new Schema({
    // User responsible for the visit
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Start date
    startOn: {
        type: Date,
        required: true
    },
    // Starting place for the visit
    origin: {
        type: Schema.Types.ObjectId,
        ref: 'place',
        required: true
    },
    // Destinations that will be included in visit
    destinations: [{type: Schema.Types.ObjectId, ref: 'place'}],
    durationNights: {
        type: Number,
        required: true,
        min: 0
    },
    groupSize: {
        type: Number,
        required: true,
        min: 1
    },
    parkedVehicles: {
        type: Number,
        required: true,
        min: 0
    },
    checkedIn: {
        type: Date
    },
    checkedOut: {
        type: Date
    },
    cancelled: {
        type: Date
    }
},
{
    timestamps: true
})

VisitSchema.pre('validate', function(next) {
    const { checkedIn, checkedOut, startOn, durationNights } = this
    if (checkedIn && startOn) {
        const startOnLeft = new Date(startOn)
        startOnLeft.setDate(startOnLeft.getDate()-1)
        if (checkedIn < startOnLeft) {
            this.invalidate('checkedIn','May be no earlier than one day before the scheduled start of the visit.')
        }
        const startOnRight = new Date(startOn)
        startOnRight.setDate(startOnRight.getDate() + durationNights + 1)
        if (checkedIn > startOnRight) {
            this.invalidate('checkedIn','May be no later than one day after the scheduled end of the visit.')
        }
    }
    if (checkedOut) {
        if (!checkedIn) {
            this.invalidate('checkedOut','May not be filled in unless visit is checked in.')
        }
        else if (checkedOut < checkedIn) {
            this.invalidate('checkedOut','May not be earlier than check in')
        }
    }
    next()
})

const populate = (visit) => {
    return visit.populate('origin').populate('destinations')
}

VisitSchema.pre('find', function() {
    populate(this)
})

VisitSchema.pre('findOne', function () {
    populate(this)
})

// After save, populate
VisitSchema.post('save', async function(visit) {
    await populate(visit).execPopulate()
})

VisitSchema.statics.searchPipeline = ({q,user,cancelled}) => {
    const c = []
    if (user) { c.push({$match: {user: ObjectId(user.id)}}) }
    // If cancellation flag not specified, return cancelled and uncancelled
    if (typeof cancelled !== 'undefined') {
        // Return only cancelled
        if (cancelled) {
            c.push({$match:{cancelled:{$ne:null}}})
        }
        // Return only uncancelled
        else {
            c.push({$match:{cancelled: null}})
        }
    }
    c.push(
        {$lookup: {from: 'places',localField:'origin',foreignField:'_id',as:'origin'}},
        {$lookup: {from: 'places',localField:'destinations',foreignField:'_id',as:'destinations'}},
        {$unwind: "$origin"}
    )
    if (q) {
        c.push(
            {$lookup: {from: 'users',localField:'user',foreignField:'_id',as:'userInfo'}}
        )
        const qc = new RegExp(q,'i')
        const qf = ['userInfo.firstName','userInfo.lastName','origin.name','destinations.name']
        c.push({$match: {$or: qf.map((f) => {
            const criterion = {}
            criterion[f] = {$regex: qc}
            return criterion
        })}})
        c.push({$project: {userInfo: 0}})
    }
    c.push({$sort: {startOn: -1, _id: 1}})
    return c
}

// Retrieve advisories that are applicable to this visit
VisitSchema.methods.applicableAdvisories = async function (context) {
    return Advisory.applicable({
        context,
        visit: this
    })
}

module.exports = Visit = mongoose.model('visit',VisitSchema);
