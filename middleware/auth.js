const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const {
    E_AUTH_INVALID_USER_TOKEN,
    E_AUTH_NEED_ROLE,
    E_AUTH_NO_USER_TOKEN
} = require('../lib/errorCodes')

module.exports = ({isOptional,roles}={}) => async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        if(!token) {
            if (isOptional) {
                return next()
            }
            else {
                return res.status(401).json({code: E_AUTH_NO_USER_TOKEN})
            }
        }

        const decoded = jwt.verify(token, config.jwtSecret)
        req.authUser = await User.findOne({_id: decoded.id})
        if (!roles || (roles && roles.filter(v => req.authUser.roles.includes(v)).length > 0)) {
            return next()
        }
        else {
            return res.status(401).json({code: E_AUTH_NEED_ROLE, roles})
        }
    } catch(e) {
        return res.status(400).json({code: E_AUTH_INVALID_USER_TOKEN})
    }
}
