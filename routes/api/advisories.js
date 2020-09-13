const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth')
const advisory = require('../../middleware/advisory')
const Advisory = require('../../models/Advisory');
const attrAccessible = (req) => {
    const attrAccessible = req.advisory ? req.advisory : {}
    const allowed = ['label','prompts','startOn','endOn','districts']
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

// @route PUT api/advisories/:advisoryId
// @desc Update an existing advisory
// @access Private
router.put('/:advisoryId', auth({roles:['admin']}), advisory(), async (req, res) => {
    attrAccessible(req)
    try {
        return res.status(200).json(await req.advisory.save())
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

// @route DELETE api/advisories
// @desc Delete an existing advisory
// @access Private
router.delete('/:advisoryId', auth({roles: ['admin']}), advisory(), async (req, res) => {
    try {
        await req.advisory.deleteOne()
        return res.json({success: true})
    }
    catch(err) {
        return res
            .status(404)
            .json({success: false});
    }
})

module.exports = router;
