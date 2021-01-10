const express = require('express')
const router = express.Router()
const {User} = require('../../models')
const user = require('../../middleware/user')
const membership = require('../../middleware/membership')
const paginate = require('../../lib/paginate')

const attrAccessible = (req) => {
    const {roles} = req.body
    return {organization: req.organization.id, roles}
}

// @desc Get all memberships for an organization
router.get(['/after/:afterId','/'],async (req, res) => {
    try {
        const {organization} = req
        const {q} = req.query
        const pipeline = organization.usersPipeline({q})
        return paginate({req, res, model: User, pipeline})
    }
    catch(err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

router.post('/:userId',user({roles:['admin']}),async (req, res) => {
    try {
        const {user} = req
        const membership = attrAccessible(req)
        user.memberships.push(membership)
        await user.save()
        return res.status(201).json(user.membership(user.memberships.length-1))
    }
    catch(err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

router.put('/:userId',user({roles:['admin']}),membership(),async (req, res) => {
    try {
        const {user} = req
        const {index} = req.membership
        user.memberships[index] = attrAccessible(req)
        await user.save()
        return res.status(200).json(user.membership(index))
    }
    catch(err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

router.delete('/:userId',user({roles:['admin']}),membership(),async (req,res) => {
    try {
        const {user} = req
        const {index} = req.membership
        user.memberships.splice(index,1)
        await user.save()
        return res.status(200).json({})
    }
    catch(err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

module.exports = router