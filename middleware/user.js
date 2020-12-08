const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const {
    E_AUTH_REQUIRED,
    E_UNAUTHORIZED
} = require('../lib/errorCodes')

module.exports = ({roles, self}={}) => asyncHandler( async (req, res, next) => {
    const user = await User.findOne({_id: req.params.userId})
    req.user = user
    if (!req.authUser) { return res.status(401).json({code: E_AUTH_REQUIRED}) }
    if (self && user._id.equals(req.authUser._id)) {
        return next()
    }
    if (roles && roles.filter(r => req.authUser.roles.includes(r)).length > 0) {
        return next()
    }
    return await res.status(401).json({code: E_UNAUTHORIZED})
})
