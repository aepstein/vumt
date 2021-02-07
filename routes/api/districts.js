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
const paginate = require('../../lib/paginate');
const { RestrictedKeyError } = require('../../lib/errors/models')
const { E_MODEL_RESTRICTED_KEY } = require('../../lib/errorCodes')

// @route GET api/districts
// @desc Get all districts
// @access Public
router.get(['/','/after/:afterId'], async (req, res) => {
    const {q} = req.query
    try {
        const qc = q ? new RegExp(q,'i') : null
        const criteria = {}
        if (qc) {
            criteria.name = { $regex: qc }
        }
        return paginate({req,res,model: District,criteria})
    }
    catch (err) {
        return res.status(500).json({code: 'ERROR'})
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

// @route DELETE api/districts
// @desc Delete an existing district
// @access Private
router.delete('/:districtId', auth({roles: ['admin']}), district(), async (req, res) => {
    try {
        await req.district.deleteOne()
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

module.exports = router