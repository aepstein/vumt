const Visit = require('../models/Visit')
const asyncHandler = require('express-async-handler')

const visit = () => asyncHandler( async (req, res, next) => {
    const visit = await Visit.findOne({_id: req.params.visitId})
    if (!req.authUser) { return res.status(401).json({msg: 'Authentication required to access visit'}) }
    if (!visit.user.equals(req.authUser._id)) {
        return await res.status(401).json({msg: 'User not authorized to access visit'})
    }
    req.visit = visit
    return next()
})

module.exports = visit;