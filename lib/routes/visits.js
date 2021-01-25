const express = require('express')
const Visit = require('../../models/Visit')
const paginate = require('../../lib/paginate')

const visits = (cancelled) => {
    const visits = express.Router()
    visits.get(['/after/:afterId','/'], async (req, res) => {
        try {
            const {user} = req
            const {q} = req.query
            const pipeline = Visit.searchPipeline({cancelled,user,q})
            return paginate({req, res, model: Visit, pipeline})
        }
        catch(err) {
            return res.status(500).json({code: 'ERROR'})
        }
    })
    return visits
}

module.exports = visits