const asyncHandler = require('express-async-handler')

module.exports = () => asyncHandler( async (req, res, next) => {
    const { organization, user } = req
    const index = user.memberships.findIndex((membership) => {
        return membership.organization._id.toString() == organization._id.toString()
    })
    if (index < 0) {
        return res.status(404)
    }
    const membership = user.memberships[index]
    req.membership = { index, membership }
    next()
})