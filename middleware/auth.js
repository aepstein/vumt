const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

module.exports = ({isOptional,roles}={}) => async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        if(!token) {
            if (isOptional) {
                return next()
            }
            else {
                return res.status(401).json({msg: 'No token, authorization denied'})
            }
        }

        const decoded = jwt.verify(token, config.jwtSecret)
        req.authUser = await User.findOne({_id: decoded.id})
        if (!roles || (roles && roles.filter(v => req.authUser.roles.includes(v)).length > 0)) {
            return next()
        }
        else {
            return res.status(401).json({msg: `Insufficient privileges. ` +
                `User must have one of these roles: ${roles.join(', ')}`})
        }
    } catch(e) {
        return res.status(400).json({msg: 'Invalid token'});
    }
}
