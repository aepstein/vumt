const { chai, server, factory } = require('../setup')
const {
    validCredentials,
    validUser,
    validVisit
} = require('./validProps');

const withAuth = async (attrs={}) => {
    const newUser = await factory.create('user',attrs)
    return chai.request(server)
        .post('/api/auth')
        .send(validCredentials(newUser));
}

const withReg = async () => {
    return chai.request(server)
        .post('/api/users')
        .send(validUser());
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
    withVisit
};