const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth')
const organization = require('../../middleware/organization')
const Organization = require('../../models/Organization');
const users = require('../../lib/routes/users')
const handleValidationError = require('../../lib/handleValidationError')
const paginate = require('../../lib/paginate')

const attrAccessible = (req) => {
    const attrAccessible = req.organization ? req.organization : {}
    const allowed = ['name']
    allowed.filter((key) => Object.keys(req.body).includes(key)).
        forEach((key) => {
            attrAccessible[key] = req.body[key]
        })
    return attrAccessible
}

// @route GET api/organizations
// @desc Get all organizations
// @access Public
router.get(['/after/:afterId','/'], async (req, res) => {
    const {q} = req.query
    try {
        const qc = q ? new RegExp(q,'i') : null
        const criteria = {}
        if (qc) {
            criteria.name = { $regex: qc }
        }
        return paginate({req,res,model: Organization,criteria})
    }
    catch (err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

// @route POST api/organizations
// @desc Create a new organization
// @access Private
router.post('/', auth({roles:['admin']}), async (req, res) => {
    const newOrganization = new Organization(attrAccessible(req))
    try {
        return res.status(201).json(await newOrganization.save())
    }
    catch(err) {
        return handleValidationError(err,res)
    }
})

// @route PUT api/organizations/:organizationId
// @desc Update an existing organization
// @access Private
router.put('/:organizationId', auth({roles:['admin']}), organization(), async (req, res) => {
    attrAccessible(req)
    try {
        return res.status(200).json(await req.organization.save())
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

// @route DELETE api/organizations
// @desc Delete an existing organization
// @access Private
router.delete('/:organizationId', auth({roles: ['admin']}), organization(), async (req, res) => {
    try {
        await req.organization.remove()
        return res.json({success: true})
    }
    catch(err) {
        return res
            .status(404)
            .json({success: false})
    }
})

// Use visits routes scoped to the user
router.use('/:organizationId/users', auth({roles: ['admin']}), organization(), users)

module.exports = router;