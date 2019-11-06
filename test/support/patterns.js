const chai = require('chai');
const server = require('../../server');
const {
    validUser
} = require('./factories');

const withUser = (cb) => {
    chai.request(server)
        .post('/api/users')
        .send(validUser())
        .end((err,regRes) => {
            regRes.should.have.status(201);
            if(err) throw err;
            cb(regRes);
            });
}

module.exports = { withUser };