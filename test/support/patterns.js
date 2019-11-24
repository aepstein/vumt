const chai = require('chai');
should = chai.should();
const server = require('../../server');
const User = require('../../models/User');
const {
    validUser,
    validCredentials
} = require('./factories');

const withAuth = async () => {
    var newUser = new User(validUser());
    await newUser.save();
    return chai.request(server)
        .post('/api/auth')
        .send(validCredentials());
}

const withReg = async () => {
    return chai.request(server)
        .post('/api/users')
        .send(validUser());
}

const withUser = async () => {
    const newUser = new User(validUser());
    return newUser.save();
}

const shouldDenyWithoutToken = async (res) => {
    await res.should.have.status(401);
    await res.body.should.have.a.property('msg').eql('No token, authorization denied')
}

module.exports = {
    shouldDenyWithoutToken,
    withAuth,
    withReg,
    withUser
};