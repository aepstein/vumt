const advisoryContexts = require('../lib/advisoryContexts')
const asyncHandler = require('express-async-handler')

const advisoryContext = (isParam) => asyncHandler( async (req, res, next) => {
    try {
        const advisoryContext = {}
        const context = Object.values(advisoryContexts).find((c) => {
            return c === (isParam ? req.params.advisoryContext : req.query.context)
        })
        const { startOn, places } = req.query
        if ( context ) { advisoryContext.context = context }
        if ( startOn ) {
            advisoryContext.startOn = new Date(parseInt(startOn))
            advisoryContext.endOn = new Date(parseInt(startOn))
        }
        if ( places ) { advisoryContext.places = JSON.parse(places) }
        req.advisoryContext = advisoryContext
    }
    catch (err) {
        return res.status(400).json({code: 'ERROR'})
    }
    return next()
})

module.exports = advisoryContext;