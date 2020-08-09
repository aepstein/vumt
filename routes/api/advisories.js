const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth')
const Advisory = require('../../models/Advisory');
const attrAccessible = (req) => {
    const attrAccessible = req.place ? req.place : {}
    const allowed = ['label','prompt']
    allowed.filter((key) => Object.keys(req.body).includes(key)).
        forEach((key) => {
            attrAccessible[key] = req.body[key]
        })
    return attrAccessible
}
const handleValidationError = require('../../lib/handleValidationError')


// @route GET api/advisories
// @desc Get all advisories
// @access Public
router.get('/', async (req, res) => {
    try {
        const advisories = await Advisory.find()
        return res.json(advisories)
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Error'})
    }
});

// @route POST api/advisories
// @desc Create a new advisory
// @access Private
router.post('/', auth({roles:['admin']}), async (req, res) => {
    const newAdvisory = new Advisory(attrAccessible(req))
    try {
        return res.status(201).json(await newAdvisory.save())
    }
    catch(err) {
        return handleValidationError(err,res)
    }
})


module.exports = router;