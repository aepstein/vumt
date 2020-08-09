const Advisory = require('../models/Advisory')
const asyncHandler = require('express-async-handler')

const advisory = () => asyncHandler( async (req, res, next) => {
    const advisory = await Advisory.findOne({_id: req.params.advisoryId})
    req.advisory = advisory
    return next()
})

module.exports = advisory;