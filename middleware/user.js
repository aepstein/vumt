const User = require('../models/User')
const asyncHandler = require('express-async-handler')

module.exports = ({roles, self}={}) => asyncHandler( async (req, res, next) => {
    const user = await User.findOne({_id: req.params.userId})
    req.user = user
    if (!req.authUser) { return res.status(401).json({msg: 'Authentication required to access user'}) }
    if (self && user._id.equals(req.authUser._id)) {
        return next()
    }
    if (roles && roles.filter(r => req.authUser.roles.includes(r)).length > 0) {
        return next()
    }
    return await res.status(401).json({msg: 'User not authorized to access user'})
})
