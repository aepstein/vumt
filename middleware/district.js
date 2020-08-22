const District = require('../models/District')
const asyncHandler = require('express-async-handler')

const district = () => asyncHandler( async (req, res, next) => {
    const district = await District.findOne({_id: req.params.districtId})
    req.district = district
    return next()
})

module.exports = district;