const { chai, server, factory } = require('../setup')
const User = require('../../models/User');
const {
    validCredentials,
    validUser,
    validVisit
} = require('./factories');

const withAuth = async () => {
    const newUser = await factory.create('user')
    return chai.request(server)
        .post('/api/auth')
        .send(validCredentials(newUser));
}

const withReg = async () => {
    return chai.request(server)
        .post('/api/users')
        .send(validUser());
}

const withUser = async (attrs={}) => {
    const newUser = new User(validUser(attrs));
    return newUser.save();
}

const withVisit = async (attrs={}) => {
    const newVisit = new Visit(validVisit(attrs));
    return newVisit.save();
}

const shouldDenyWithoutToken = async (res) => {
    await res.should.have.status(401);
    await res.body.should.have.a.property('msg').eql('No token, authorization denied')
}

module.exports = {
    shouldDenyWithoutToken,
    withAuth,
    withReg,
    withUser,
    withVisit
};