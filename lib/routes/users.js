const express = require('express')
const router = express.Router()
const {User} = require('../../models')
const paginate = require('../../lib/paginate')

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

module.exports = router