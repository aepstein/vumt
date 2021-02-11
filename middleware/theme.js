const Theme = require('../models/Theme')
const asyncHandler = require('express-async-handler')

const theme = () => asyncHandler( async (req, res, next) => {
    const theme = await Theme.findOne({_id: req.params.themeId})
    req.theme = theme
    return next()
})

module.exports = theme;