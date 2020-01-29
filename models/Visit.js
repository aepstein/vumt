const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;
const Place = require('./Place')
const tz = require('timezone')

const VisitSchema = new Schema({
    // User responsible for the visit
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Start date - UTC time calculated
    startOn: {
        type: Date
    },
    // Start date - HTML5 string
    startOnDate: {
        type: String,
        match: /^\d{4,4}-\d{2,2}-\d{2,2}$/,
        required: true
    },
    // Start time - HTML5 string
    startOnTime: {
        type: String,
        match: /^\d{2,2}:\d{2,2}$/,
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
    }
},
{
    timestamps: true
});

VisitSchema.pre('save', async function () {
    const origin = ((this.origin instanceof Object) && this.origin.timezone) ? 
        this.origin : await Place.findById(this.origin)
    const timezone = origin.timezone
    local = tz(require(`timezone/${timezone}`))
    this.startOn = new Date(local(`${this.startOnDate} ${this.startOnTime}`,timezone))
})

// Populate origin, destinations on load
VisitSchema.post('find', async function(visits) {
    for (let visit of visits) {
        await visit.populate('origin').populate('destinations').execPopulate()
    }
})

// After save, populate
VisitSchema.post('save', async function(visit) {
    await visit.populate('origin').populate('destinations').execPopulate()
})

module.exports = Visit = mongoose.model('visit',VisitSchema);
