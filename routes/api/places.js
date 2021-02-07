const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth')
const place = require('../../middleware/place')
const Place = require('../../models/Place');
const handleValidationError = require('../../lib/handleValidationError')
const paginate = require('../../lib/paginate')
const { RestrictedKeyError } = require('../../lib/errors/models')
const { E_MODEL_RESTRICTED_KEY } = require('../../lib/errorCodes')

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
// @desc Get places that can be starting points for visits
// @access Public
router.get(['/after/:afterId','/'], async (req, res) => {
    try {
        const startOn = new Date(req.query.startOn)
        const { q, type, location } = req.query
        const pipeline = Place.searchPipeline({location,q,startOn,type})
        return paginate({req, res, model: Place, pipeline})
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Error'})
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
        return handleValidationError(err,res)
    }
})

// @route PUT api/places/:placeId
// @desc Update an existing place
// @access Private
router.put('/:placeId', auth({roles:['admin']}), place(), async (req, res) => {
    attrAccessible(req)
    try {
        return res.status(200).json(await req.place.save())
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

// @route DELETE api/places
// @desc Delete an existing place
// @access Private
router.delete('/:placeId', auth({roles: ['admin']}), place(), async (req, res) => {
    try {
        await req.place.deleteOne()
        return res.json({success: true})
    }
    catch(err) {
        if (err instanceof RestrictedKeyError) {
            return res
                .status(409)
                .json({code: E_MODEL_RESTRICTED_KEY, ...err})
        }
        return res
            .status(404)
            .json({success: false});
    }
})

module.exports = router;