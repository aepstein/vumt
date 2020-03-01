const ValidationError = require('mongoose/lib/error/validation')
const ValidatorError = require('mongoose/lib/error/validator')

function handleMongoError11000(err,res, next) {
    if (err.name === 'MongoError' && err.code === 11000) {
        const keys = Object.keys(err.keyPattern)
        const vErr = new ValidationError(this)
        vErr.addError(keys[0],new ValidatorError({
            type: 'duplicateKey',
            path: keys[0],
            value: err.keyValue[keys[0]],
            message: `Path \`${keys.join(',')}\` must be unique. Value: \`${keys.map(v => err.keyValue[v]).join(',')}\``
        }))
        next(vErr)
    }
    next(err,res)
}

module.exports.useHandleMongoError11000 = (schema) => {
    schema.post('save',handleMongoError11000)
    schema.post('update',handleMongoError11000)
    schema.post('findOneAndUpdate',handleMongoError11000)
    schema.post('insertMany',handleMongoError11000)
}
