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
    userId: {
        type: String,
        required: true
    }
});

module.exports = Visit = mongoose.model('visit',VisitSchema);
