const { chai, server, factory } = require('../setup')
const {
    validCredentials,
    validUser,
    validVisit
} = require('./validProps');

module.exports.withAuth = async (attrs={}) => {
    const newUser = await factory.create('user',attrs)
    return chai.request(server)
        .post('/api/auth')
        .send(validCredentials(newUser));
}

module.exports.withReg = async () => {
    return chai.request(server)
        .post('/api/users')
        .send(validUser());
}

module.exports.withVisit = async (attrs={}) => {
    const newVisit = new Visit(validVisit(attrs));
    return newVisit.save();
}
