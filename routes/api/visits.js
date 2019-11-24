const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Visit = require('../../models/Visit');

// @route GET api/visits
// @desc Get all visits
// @access Public
router.get('/', (req, res) => {
    Visit
        .find()
        .sort({date: -1})
        .then( (visits) => {
            res.json(visits);
        });
});

// @route POST api/visits
// @desc Create a new visit
// @access Private
router.post('/', auth, (req, res) => {
    const {
        name
    } = req.body;
    if (!name) {
        return res.status(400)
            .json({
                msg: 'Provide required fields'
            });
    }
    const newVisit = new Visit({
        name,
        userId: req.user.id
    });
    newVisit
        .save()
        .then( (visit) => {
            res.status(201)
                .json(visit);
        });
});

// @route DELETE api/visits
// @desc Delete an existing visit
// @access Private
router.delete('/:id', auth, (req, res) => {
    Visit
        .findById(req.params.id)
        .then((visit) => {
            visit
                .remove()
                .then(() => res.json({success: true}))
        })
        .catch((err) => {
            res
                .status(404)
                .json({success: false});
        });
});

module.exports = router;