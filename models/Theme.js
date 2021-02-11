const mongoose = require('../db/mongoose')
const Schema = mongoose.Schema
const TranslationSchema = require('./schemas/TranslationSchema')
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')
const Advisory = require('./Advisory')
const { RestrictedKeyError } =  require('../lib/errors/models')

const ThemeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        labels: [TranslationSchema],
        color: {
            type: String,
            enum: ['primary','secondary','success','danger','warning','info','light','dark'],
            required: true
        }
    },
    {
        collection: 'themes',
        timestamps: true
    }
)

ThemeSchema.pre('deleteOne',{document: true},async function() {
    const advisory = await Advisory.findOne({theme: this.id})
    if (advisory) {
        throw new RestrictedKeyError(this, advisory, 'theme')
    }
    return true
})

useHandleMongoError11000(ThemeSchema)

module.exports = Theme = mongoose.model('theme',ThemeSchema)