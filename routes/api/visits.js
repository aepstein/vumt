const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Visit = require('../../models/Visit');
const visit = require('../../middleware/visit')
const handleValidationError = require('../../lib/handleValidationError')
const attrAccessible = (req) => {
    const attrAccessible = req.visit ? req.visit : {}
    const allowed = ['startOn','origin','destinations','durationNights','groupSize','parkedVehicles','checkedIn',
        'checkedOut']
    allowed.filter((key) => Object.keys(req.body).includes(key)).
        forEach((key) => {
            attrAccessible[key] = req.body[key]
        })
    return attrAccessible
}

// @route GET api/visits
// @desc Get all visits
// @access Public
// @route GET api/users/:userId/visits
// @desc Get user's visits
// @access Public
router.get('/', async (req, res) => {
    let criteria = {}
    if (req.userId) { criteria.user = req.userId }
    const visits = await Visit
        .find(criteria)
        .sort({date: -1})
    return res.json(visits)
});

// @route GET api/visits/:visitId
// @desc Load a single visit
// @access Private
router.get('/:visitId', auth(), visit(), async (req, res) => {
    return res.status(200).json(req.visit)
})

// @route PUT api/visits/:visitId
// @desc Update an existing visit
// @access Private
router.put('/:visitId', auth(), visit(), async (req, res) => {
    attrAccessible(req)
    try {
        return res.status(200).json(await req.visit.save())
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

// @route POST api/visits
// @desc Create a new visit
// @access Private
router.post('/', auth(), async (req, res) => {
    const newVisit = new Visit({
        ...attrAccessible(req),
        user: req.authUser._id
    });
    try {
        return res.status(201).json(await newVisit.save())
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

// @route DELETE api/visits
// @desc Delete an existing visit
// @access Private
router.delete('/:visitId', auth(), visit(), async (req, res) => {
    try {
        await req.visit.deleteOne()
        return res.json({success: true})
    }
    catch(err) {
        return res
            .status(404)
            .json({success: false});
    }
});

module.exports = router;