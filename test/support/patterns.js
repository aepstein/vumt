const chai = require('chai');
const server = require('../../server');
const User = require('../../models/User');
const {
    validUser
} = require('./factories');

const withReg = (cb) => {
    chai.request(server)
        .post('/api/users')
        .send(validUser())
        .end((err,regRes) => {
            regRes.should.have.status(201);
            if(err) throw err;
            cb(regRes);
            });
}

const withUser = (cb) => {
    var newUser = new User(validUser());
    newUser.save().then((user) => {
        cb(user);
    });
}

module.exports = {
    withReg,
    withUser
};