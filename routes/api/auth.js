const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const resetPasswordToken = require('../../middleware/resetPasswordToken')
const passwordResetMailer = require('../../mailers/passwordResetMailer')
const {
  E_AUTH_MISSING_EMAIL,
  E_AUTH_MISSING_PASSWORD,
  E_AUTH_NO_USER,
  E_AUTH_INVALID_PASSWORD
} = require('../../lib/errorCodes')
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post('/', async (req, res) => {
  const { email, password } = req.body

  // Simple validation
  if(!email) {
    return res.status(400).json({ code: E_AUTH_MISSING_EMAIL })
  }

  if(!password) {
    return res.status(400).json({ code: E_AUTH_MISSING_PASSWORD })
  }

  // Check for existing user
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ code: E_AUTH_NO_USER })

  const isMatch = await user.comparePassword(password)
  if(!isMatch) return res.status(400).json({ code: E_AUTH_INVALID_PASSWORD })

  const token = await user.genToken()
  return res.status(201).json({
    token,
    user: { ...user.pubProps() }
  })
})

// @route   POST api/resetPassword/:email
// @desc    Initiate password reset
// @access  Public
router.post('/resetPassword/:email',async (req, res) => {
  const user = await User.findOne({email: req.params.email})
  if (user) {
    try {
      const token = await user.createResetPasswordToken(req)
      await passwordResetMailer(user,token,req)
      return res.status(201).json({code: 'success'})
    }
    catch(err) {
      return res.status(500).json({code: ''})
    }
  }
  else {
    return res.status(404).json({code: E_AUTH_NO_USER})
  }
})

// @route   GET api/resetPassword/:email/:token
// @desc    Confirm token
// @access  Public
router.get('/resetPassword/:email/:token',resetPasswordToken(),async (req,res) => {
  const { expires } = req.resetPasswordToken
  return res.status(200).json({code: "validToken", expires})
})

// @route   PUT api/resetPassword/:email/:token
// @desc    Confirm token
// @access  Public
router.put('/resetPassword/:email/:token',resetPasswordToken(),async (req,res) => {
  const { password } = req.body
  const { user, token } = req.resetPasswordToken
  await user.resetPasswordWithToken(token,password)
  const authToken = await user.genToken()
  return res.status(200).json({
    token: authToken,
    user: { ...user.pubProps() }
  })
})

// @route   GET api/auth
// @desc    Get information of authenticated user
// @access  Public
router.get('/user', auth(), async (req, res) => {
  const user = await User.findById(req.authUser._id)
  return res.json(user.pubProps());
})

module.exports = router;