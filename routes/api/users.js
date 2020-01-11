const express = require('express');
const router = express.Router();
const config = require('config');
const jwtSecret = config.jwtSecret;
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// Use visits routes scoped to the user
router.use(
    '/:userId/visits',
    function (req, res, next) {
        req.userId = req.params.userId;
        next();
    },
    require('./visits')
);

// @route POST api/users
// @desc Register a new user
// @access Public
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, country, province } = req.body
    if (!firstName || !lastName || !email || !password || !country) {
        return res.status(400).json({msg: 'Please enter required fields'})
    }
    const user = await User.findOne({email})
    if (user) return res.status(400).json({msg: 'User already exists with that email'})

    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        country,
        province
    })
    const savedUser = await newUser.save()
    try {
        const token = await jwt.sign(
            { id: savedUser.id },
            jwtSecret,
            { expiresIn: 3600 }
        )
        return res.status(201).json({
            token,
            user: {
                _id: savedUser.id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                country: savedUser.country,
                province: savedUser.province
            }
        })
    }
    catch(err) { throw err }
});

module.exports = router;