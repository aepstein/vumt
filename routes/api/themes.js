const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth')
const theme = require('../../middleware/theme')
const Theme = require('../../models/Theme');
const attrAccessible = (req) => {
    const attrAccessible = req.theme ? req.theme : {}
    const allowed = ['name','labels','color']
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

// @route GET api/themes
// @desc Get all themes
// @access Public
router.get(['/','/after/:afterId'], async (req, res) => {
    const {q} = req.query
    try {
        const qc = q ? new RegExp(q,'i') : null
        const criteria = {}
        if (qc) {
            criteria.$or = [
                {name: {$regex: qc}},
                {'labels.translation': {$regex: qc}}
            ]
        }
        return paginate({req,res,model: Theme,criteria})
    }
    catch (err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

// @route POST api/themes
// @desc Create a new theme
// @access Private
router.post('/', auth({roles:['admin']}), async (req, res) => {
    const newTheme = new Theme(attrAccessible(req))
    try {
        return res.status(201).json(await newTheme.save())
    }
    catch(err) {
        return handleValidationError(err,res)
    }
})

// @route PUT api/themes/:themeId
// @desc Update an existing theme
// @access Private
router.put('/:themeId', auth({roles:['admin']}), theme(), async (req, res) => {
    attrAccessible(req)
    try {
        return res.status(200).json(await req.theme.save())
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

// @route DELETE api/themes
// @desc Delete an existing theme
// @access Private
router.delete('/:themeId', auth({roles: ['admin']}), theme(), async (req, res) => {
    try {
        await req.theme.deleteOne()
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