const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;

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
    }
},
{
    timestamps: true
});

module.exports = Visit = mongoose.model('visit',VisitSchema);
