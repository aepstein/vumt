const mongoose = require('../../db/mongoose');

const TranslationSchema = new mongoose.Schema({
    language: {
        type: String,
        enum: ['en-US','es','fr','he'],
        required: true
    },
    translation: {
        type: String,
        required: true
    }
})

module.exports = TranslationSchema