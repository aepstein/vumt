const express = require('express');
const router = express.Router();
const config = require('config');
const jwtSecret = config.jwtSecret;
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth')
const user = require('../../middleware/user')
const handleValidationError = require('../../lib/handleValidationError')

const User = require('../../models/User');

const attrAccessible = (req) => {
    const attrAccessible = req.user ? req.user : {}
    let allowed = ['firstName','lastName','email','enableGeolocation','password','country','province','postalCode','phone']
    if (req.authUser && req.authUser.roles.includes('admin')) {
        allowed = allowed.concat(['roles'])
    }
    allowed.filter((key) => Object.keys(req.body).includes(key)).
        forEach((key) => {
            attrAccessible[key] = req.body[key]
        })
    return attrAccessible
}
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
router.post('/',auth({isOptional: true, roles:['admin']}), async (req, res) => {
    const newUser = new User({
        ...attrAccessible(req)
    })
    try {
        const savedUser = await newUser.save()
        if (req.authUser) {
            return res.status(201).json(savedUser.pubProps())
        }
        const token = await jwt.sign(
            { id: savedUser.id },
            jwtSecret,
            { expiresIn: 3600 }
        )
        return res.status(201).json({
            token,
            user: {
                ...savedUser.pubProps()
            }
        })
    }
    catch(err) {
        if (err.name === 'ValidationError') {
            return handleValidationError(err,res)
        }
        else {
            throw err
        }
    }
});

// @route PUT api/users
// @desc Update an existing user
// @access Public
router.put('/:userId',auth(),user({self:true,roles:['admin']}),async (req,res) => {
    attrAccessible(req)
    try {
        const savedUser = await req.user.save()
        delete savedUser.password
        return res.status(200).json(savedUser)
    }
    catch(err) {
        if (err.name === 'ValidationError') {
            return handleValidationError(err,res)
        }
        else {
            throw err
        }
    }
})

// @route GET api/users
// @desc Get listing of users
// @access Private
router.get('/',auth({roles:['admin']}),async (req,res) => {
    let criteria = {}
    const users = await User
        .find(criteria)
        .sort({lastName: 1, firstName: 1, middleName: 1, email: 1})
    return res.json(users.map(u => u.pubProps()))
})

// @route DELETE api/users/:userId
// @desc Delete a user
// @access Private
router.delete('/:userId',auth(),user({roles:['admin']}),async (req,res) => {
    try {
        req.user.deleteOne()
        return res.json({success: true})
    }
    catch(err) {
        return res.status(404).json({success: false})
    }
})

module.exports = router;