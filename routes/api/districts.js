const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth')
const district = require('../../middleware/district')
const District = require('../../models/District');
const attrAccessible = (req) => {
    const attrAccessible = req.district ? req.district : {}
    const allowed = ['name','boundaries']
    allowed.filter((key) => Object.keys(req.body).includes(key)).
        forEach((key) => {
            attrAccessible[key] = req.body[key]
        })
    return attrAccessible
}
const handleValidationError = require('../../lib/handleValidationError')

// @route GET api/districts
// @desc Get all districts
// @access Public
router.get('/', async (req, res) => {
    try {
        const districts = await District.find()
        return res.json(districts)
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Error'})
    }
})

// @route POST api/districts
// @desc Create a new district
// @access Private
router.post('/', auth({roles:['admin']}), async (req, res) => {
    const newDistrict = new District(attrAccessible(req))
    try {
        return res.status(201).json(await newDistrict.save())
    }
    catch(err) {
        return handleValidationError(err,res)
    }
})

// @route PUT api/districts/:districtId
// @desc Update an existing district
// @access Private
router.put('/:districtId', auth({roles:['admin']}), district(), async (req, res) => {
    attrAccessible(req)
    try {
        return res.status(200).json(await req.district.save())
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

module.exports = router