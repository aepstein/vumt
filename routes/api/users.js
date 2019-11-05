const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwtSecret = config.jwtSecret;
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

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
            bcrypt.genSalt(10,(err,salt) => {
                if (err) {
                    throw err;
                }
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                { userId: user.id },
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
        });
});

module.exports = router;