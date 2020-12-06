const Visit = require('../models/Visit')
const asyncHandler = require('express-async-handler')
const {
    E_AUTH_REQUIRED,
    E_UNAUTHORIZED
} = require('../lib/errorCodes')
const visit = () => asyncHandler( async (req, res, next) => {
    const visit = await Visit.findOne({_id: req.params.visitId})
    if (!req.authUser) { return res.status(401).json({code: E_AUTH_REQUIRED}) }
    if (!visit.user.equals(req.authUser._id)) {
        return await res.status(401).json({code: E_UNAUTHORIZED})
    }
    req.visit = visit
    return next()
})

module.exports = visit;