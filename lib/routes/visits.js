const express = require('express')
const router = express.Router()
const Visit = require('../../models/Visit')
const paginate = require('../../lib/paginate')

router.get(['/after/:afterId','/'], async (req, res) => {
    try {
        const {user} = req
        const {q} = req.query
        const pipeline = Visit.searchPipeline({user,q})
        return paginate({req, res, model: Visit, pipeline})
    }
    catch(err) {
        return res.status(500).json({code: 'ERROR'})
    }
})

module.exports = router