const mongoose = require('../../db/mongoose');

const MultiPolygonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['MultiPolygon'],
        required: true
    },
    coordinates: {
        type: [[[[Number]]]],
        required: true
    }
})

module.exports = MultiPolygonSchema