const express = require('express');
const router = express.Router();
// const auth = require('../../middleware/auth');

const Place = require('../../models/Place');

// @route GET api/places
// @desc Get all places
// @access Public
// @route GET api/places/origins
// @desc Get places that can be starting points for visits
// @access Public
router.get('/:type?', (req, res) => {
    let criteria = {}
    switch(req.params.type) {
        case 'origins':
            criteria.isOrigin = true
            break
        case 'destinations':
            criteria.isDestination = true
            break
    }
    Place
        .find(criteria)
        .sort({name: 1})
        .then( (places) => {
            res.json(places);
        })
        .catch(err => console.log(err));
});

module.exports = router;