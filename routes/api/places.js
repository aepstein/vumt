const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth')
const Place = require('../../models/Place');
const handleValidationError = require('../../lib/handleValidationError')

const attrAccessible = (req) => {
    const attrAccessible = req.place ? req.place : {}
    const allowed = ['name','location','isOrigin','isDestination','parkingCapacity','timezone']
    allowed.filter((key) => Object.keys(req.body).includes(key)).
        forEach((key) => {
            attrAccessible[key] = req.body[key]
        })
    return attrAccessible
}


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

// @route POST api/places
// @desc Create a new place
// @access Private
router.post('/', auth({roles:['admin']}), async (req, res) => {
    const newPlace = new Place(attrAccessible(req))
    try {
        return res.status(201).json(await newPlace.save())
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

module.exports = router;