const express = require('express');
const router = express.Router();
const config = require('config');
const jwtSecret = config.jwtSecret;
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth')
const user = require('../../middleware/user')
const handleValidationError = require('../../lib/handleValidationError')
const visits = require('../../lib/routes/visits')
const paginate = require('../../lib/paginate')

const User = require('../../models/User');

const attrAccessible = (req) => {
    const attrAccessible = req.user ? req.user : {}
    let allowed = ['firstName','lastName','email','enableGeolocation','password','country','province','postalCode','phone',
        'distanceUnitOfMeasure']
    if (req.authUser && req.authUser.roles.includes('admin')) {
        allowed = allowed.concat(['roles','memberships'])
    }
    allowed.filter((key) => Object.keys(req.body).includes(key)).
        forEach((key) => {
            attrAccessible[key] = req.body[key]
        })
    return attrAccessible
}
// Use visits routes scoped to the user
router.use('/:userId/visits/cancelled', auth(), user({self: true, roles:['admin']}), visits(true))
router.use('/:userId/visits', auth(), user({self: true, roles:['admin']}), visits(false))

// @route POST api/users
// @desc Register a new user
// @access Public
router.post('/',auth({isOptional: true, roles:['admin']}), async (req, res) => {
    const newUser = new User({
        ...attrAccessible(req)
    })
    try {
        const {_id} = await newUser.save()
        const savedUser = await User.findOne({_id})
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
        const {_id} = await req.user.save()
        const savedUser = await User.findOne({_id})
        return res.status(200).json(savedUser.pubProps())
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
router.get(['/','/after/:afterId'],auth({roles:['admin']}),async (req,res) => {
    const {q} = req.query
    try {
        const qc = q ? new RegExp(q,'i') : null
        const criteria = {}
        if (qc) {
            criteria.$or = []
            criteria.$or.push({email: { $regex: qc }})
            criteria.$or.push({firstName: { $regex: qc }})
            criteria.$or.push({lastName: { $regex: qc }})
        }
        const select = {password: 0, resetPasswordTokens: 0}
        return paginate({req,res,model: User,criteria,select})
    }
    catch (err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

// @route DELETE api/users/:userId
// @desc Delete a user
// @access Private
router.delete('/:userId',auth(),user({roles:['admin']}),async (req,res) => {
    try {
        await req.user.deleteOne()
        return res.json({success: true})
    }
    catch(err) {
        return res.status(404).json({success: false})
    }
})

module.exports = router;