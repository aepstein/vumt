const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const resetPasswordToken = () => asyncHandler( async (req, res, next) => {
    const user = await User.findOne({email: req.params.email})
    if (!user) {
      return res.status(404).json({code: "noEmail"})
    }
    const token = user.resetPasswordTokens.find((t) => {
      return t.token === req.params.token
    })
    if (!token) {
      return res.status(404).json({code: "noToken"})
    }
    if (token.expires < Date.now()) {
      return res.status(401).json({code: "expired"})
    }
    if (token.expended) {
      return res.status(403).json({code: "expended"})
    }
    req.resetPasswordToken = {
      token: token.token,
      expires: token.expires,
      user
    }
    return next()
})

module.exports = resetPasswordToken;