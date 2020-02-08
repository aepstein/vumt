const Place = require('../models/Place')
const asyncHandler = require('express-async-handler')

const place = () => asyncHandler( async (req, res, next) => {
    const place = await Place.findOne({_id: req.params.placeId})
    req.place = place
    return next()
})

module.exports = place;