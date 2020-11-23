const advisoryContexts = require('../lib/advisoryContexts')
const asyncHandler = require('express-async-handler')

const advisoryContext = (isParam) => asyncHandler( async (req, res, next) => {
    const advisoryContext = Object.values(advisoryContexts).find((c) => {
        return c === (isParam ? req.params.advisoryContext : req.query.context)
    })
    req.advisoryContext = advisoryContext
    return next()
})

module.exports = advisoryContext;