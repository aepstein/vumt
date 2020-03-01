const handleMongooseValidationError = async function (err,res) {
    const msgs = Object.keys(err.errors).map((k) => {
        return err.errors[k].message
    })
    const validationErrors = Object.keys(err.errors).map(p => {
        const { path, kind, value, message} = err.errors[p]
        return { path, kind, value, message }       
    })
    return res.status(400).json({
        msg: msgs.join(' '),
        validationErrors
    })
}

module.exports = async function handleValidationError(err,res) {
    switch(err.name) {
        case 'ValidationError':
            return handleMongooseValidationError(err,res)
    }
    throw(err)
}