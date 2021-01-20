const mongoose = require('../../db/mongoose');
const adoc = require('asciidoctor')()

const TranslationSchema = new mongoose.Schema({
    language: {
        type: String,
        enum: ['en-US','es','fr','he'],
        required: true
    },
    translation: {
        type: String,
        required: true
    },
    translationHTML: {
        type: String,
        required: false
    }
})

TranslationSchema.pre('validate',async function () {
    if (this.translation) {
        this.translationHTML = await adoc.convert(this.translation)
    }
})

module.exports = TranslationSchema