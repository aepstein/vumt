const chai = require('chai');
should = chai.should();
const server = require('../../server');
const Place = require('../../models/Place')
const User = require('../../models/User');
const {
    validCredentials,
    validPlaceOrigin,
    validUser,
    validVisit
} = require('./factories');

const withAuth = async () => {
    var newUser = new User(validUser());
    await newUser.save();
    return chai.request(server)
        .post('/api/auth')
        .send(validCredentials());
}

const withPlace = async (attrs={}) => {
    const newPlace = new Place({
        ...validPlaceOrigin(),
        ...attrs
    })
    return newPlace.save()
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
    withPlace,
    withReg,
    withUser,
    withVisit
};