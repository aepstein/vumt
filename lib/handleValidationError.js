module.exports = async function handleValidationError(err,res) {
    const msgs = Object.keys(err.errors).map((k) => {
        return err.errors[k].message
    })
    return res.status(400).json({msg: msgs.join(' ')})
}