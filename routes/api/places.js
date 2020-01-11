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
router.get('/:type?', async (req, res) => {
    let criteria = {}
    switch(req.params.type) {
        case 'origins':
            criteria.isOrigin = true
            break
        case 'destinations':
            criteria.isDestination = true
            break
    }
    try {
        const places = await Place
            .find(criteria)
            .sort({name: 1})
        return res.json(places)
    }
    catch(err) {
        console.log(err)
    }
});

module.exports = router;