const mongoose = require('../db').mongoose;
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Visit = mongoose.model('visit',VisitSchema);
