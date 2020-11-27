const express = require('express');
const router = express.Router();
const config = require('config');
const jwtSecret = config.jwtSecret;
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post('/', async (req, res) => {
  const { email, password } = req.body

  // Simple validation
  if(!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }

  // Check for existing user
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ msg: 'User does not exist' })

  // Validate password
  const isMatch = await user.comparePassword(password)
  if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })
  
  try {
    const token = await jwt.sign(
      { id: user.id },
      jwtSecret,
      { expiresIn: 3600 }
    )
    return res.status(201).json({
      token,
      user: {
        ...user.pubProps()
      }
    })
  }
  catch(err) { throw err }
})

// @route   POST api/resetPassword/:email
// @desc    Initiate password reset
// @access  Public
router.post('/resetPassword/:email',async (req, res) => {
  const user = await User.findOne({email: req.params.email})
  if (user) {
    await user.resetPassword(req.headers.host)
    return res.status(201).json({msg: "Password reset email sent"})
  }
  else {
    return res.status(404).json({msg: "No user registered with email"})
  }
})

// @route   GET api/auth
// @desc    Get information of authenticated user
// @access  Public
router.get('/user', auth(), async (req, res) => {
  const user = await User.findById(req.authUser._id)
  return res.json(user.pubProps());
})

module.exports = router;