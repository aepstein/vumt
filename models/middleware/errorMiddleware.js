const ValidationError = require('mongoose/lib/error/validation')
const ValidatorError = require('mongoose/lib/error/validator')

function keysFromMongoError11000(err) {
    if (err.keyPattern) return {
        keys: Object.keys(err.keyPattern),
        values: Object.keys(err.keyPattern).map(v => err.keyValue[v])
    }
    const m = (/index: ([a-zA-Z_]+)_\d+ dup key: { [^:]*: "([^"]+)" }/).exec(err.errmsg)
    return {keys: [m[1]], values: [m[2]]}
}

function handleMongoError11000(err,res, next) {
    if (err.name === 'MongoError' && err.code === 11000) {
        const {keys,values} = keysFromMongoError11000(err)
        const vErr = new ValidationError(this)
        vErr.addError(keys[0],new ValidatorError({
            type: 'duplicateKey',
            path: keys[0],
            value: values[0],
            message: `Path \`${keys.join(',')}\` must be unique. Value: \`${values.join(',')}\``
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
