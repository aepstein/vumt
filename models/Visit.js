const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // User responsible for the visit
    userId: {
        type: String,
        required: true
    },
    // Starting place for the visit
    origin: {
        type: Schema.Types.ObjectId,
        ref: 'place'
    }
},
{
    timestamps: true
});

module.exports = Visit = mongoose.model('visit',VisitSchema);
