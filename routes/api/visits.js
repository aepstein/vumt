const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Visit = require('../../models/Visit');

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
        .populate('origin')
        .populate('destinations')
        .sort({date: -1})
    return res.json(visits)
});

// @route POST api/visits
// @desc Create a new visit
// @access Private
router.post('/', auth, async (req, res) => {
    const {
        startOn,
        origin,
        destinations
    } = req.body;
    if (!origin || !startOn) {
        return res.status(400)
            .json({
                msg: 'Provide required fields'
            })
    }
    const newVisit = new Visit({
        user: req.user.id,
        startOn,
        origin,
        destinations
    });
    const savedVisit = await newVisit.save()
    const populatedVisit = await savedVisit
        .populate('origin')
        .populate('destinations')
        .execPopulate()
    return res.status(201).json(populatedVisit);
});

// @route DELETE api/visits
// @desc Delete an existing visit
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const visit = Visit.findById(req.params.id)
        await visit.deleteOne()
        return res.json({success: true})
    }
    catch(err) {
        return res
            .status(404)
            .json({success: false});
    }
});

module.exports = router;