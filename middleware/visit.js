const Visit = require('../models/Visit')
const asyncHandler = require('express-async-handler')
const {
    E_AUTH_REQUIRED,
    E_UNAUTHORIZED
} = require('../lib/errorCodes')
const visit = ({roles, self}={}) => asyncHandler( async (req, res, next) => {
    const visit = await Visit.findOne({_id: req.params.visitId})
    req.visit = visit
    if (!req.authUser) { return res.status(401).json({code: E_AUTH_REQUIRED}) }
    if (self && visit.user.equals(req.authUser._id)) {
        return next()
    }
    if (roles && roles.filter(r => req.authUser.roles.includes(r)).length > 0) {
        return next()
    }
    if (!self && !roles) {
        return next()
    }
    return await res.status(403).json({code: E_UNAUTHORIZED})
})

module.exports = visit;