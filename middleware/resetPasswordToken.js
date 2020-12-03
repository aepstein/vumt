const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const {
  E_AUTH_EXPENDED_PASSWORD_RESET_TOKEN,
  E_AUTH_EXPIRED_PASSWORD_RESET_TOKEN,
  E_AUTH_NO_PASSWORD_RESET_TOKEN,
  E_AUTH_NO_USER
} = require('../lib/errorCodes')
const resetPasswordToken = () => asyncHandler( async (req, res, next) => {
    const user = await User.findOne({email: req.params.email})
    if (!user) {
      return res.status(404).json({code: E_AUTH_NO_USER})
    }
    const token = await user.resetPasswordTokens.find((t) => {
      return t.token === req.params.token
    })
    if (!token) {
      return res.status(404).json({code: E_AUTH_NO_PASSWORD_RESET_TOKEN})
    }
    if (token.expires < Date.now()) {
      return res.status(401).json({code: E_AUTH_EXPIRED_PASSWORD_RESET_TOKEN})
    }
    if (token.expended) {
      return res.status(403).json({code: E_AUTH_EXPENDED_PASSWORD_RESET_TOKEN})
    }
    req.resetPasswordToken = {
      token: token.token,
      expires: token.expires,
      user
    }
    return next()
})

module.exports = resetPasswordToken;