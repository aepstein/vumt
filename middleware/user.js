const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const user = () => asyncHandler( async (req, res, next) => {
    const user = await User.findOne({_id: req.params.userId})
    if (!req.authUser) { return res.status(401).json({msg: 'Authentication required to access user'}) }
    if (user._id != req.authUser.id) {
        return await res.status(401).json({msg: 'User not authorized to access user'})
    }
    req.user = user
    return next()
})

module.exports = user;