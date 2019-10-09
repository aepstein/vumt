const express = require('express');
const router = express.Router();

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
// @access Public
router.post('/', (req, res) => {
    const newVisit = new Visit({
        name: req.body.name
    })
    newVisit
        .save()
        .then( (visit) => {
            res.json(visit);
        })
});

// @route DELETE api/visits
// @desc Delete an existing visit
// @access Public
router.delete('/:id', (req, res) => {
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