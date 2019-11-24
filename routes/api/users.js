const express = require('express');
const router = express.Router();
const config = require('config');
const jwtSecret = config.jwtSecret;
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// Use visits routes scoped to the user
router.use(
    '/:userId/visits',
    function (req, res, next) {
        req.userId = req.params.userId;
        next();
    },
    require('./visits')
);

// @route POST api/users
// @desc Register a new user
// @access Public
router.post('/', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({msg: 'Please enter required fields'});
    }
    User.findOne({email})
        .then(user => {
            if (user) return res.status(400).json({msg: 'User already exists with that email'});
            const newUser = new User({
                firstName,
                lastName,
                email,
                password
            });
            newUser.save()
                .then(user => {
                    jwt.sign(
                        { id: user.id },
                        jwtSecret,
                        { expiresIn: 3600 },
                        (err,token) => {
                            if(err) throw err;
                            res.status(201).json({
                                token,
                                user: {
                                    id: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email
                                }
                            });
                        }
                    );
                });
        });
});

module.exports = router;