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
const advisoryContext = require('../../middleware/advisoryContext')

// @route GET api/visits/:visitId
// @desc Load a single visit
// @access Private
router.get('/:visitId', auth(), visit(), async (req, res) => {
    return res.status(200).json(req.visit)
})

// @route GET api/visits/:visitId/applicableVisits
// @desc Load advisories applicable to a visit
// @access Private
router.get('/:visitId/applicableAdvisories/:advisoryContext', auth(), visit(), advisoryContext(true), async (req, res) => {
    return res.status(200).json(await req.visit.applicableAdvisories(req.advisoryContext))
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

// @route POST api/visits/cancelled/:visitId
// @desc Cancel a not-yet-cancelled visit
// @access Private
router.post('/cancelled/:visitId', auth(), visit(), async (req,res) => {
    if (req.visit.cancelled) {
        return res.status(409).json({})
    }
    try {
        req.visit.cancelled = Date.now()
        return res.status(200).json(await req.visit.save())
    }
    catch(err) {
        throw err
    }
})

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

// @route GET api/visits
// @desc Get all visits
// @access Private
router.use('/', auth({roles:['admin']}), require('../../lib/routes/visits'))

module.exports = router;