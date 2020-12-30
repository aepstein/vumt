const {Organization} = require('../models')
const asyncHandler = require('express-async-handler')

const organization = () => asyncHandler( async (req, res, next) => {
    const organization = await Organization.findOne({_id: req.params.organizationId})
    req.organization = organization
    return next()
})

module.exports = organization;