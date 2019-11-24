const User = require('../models/User');
const chai = require('chai');
should = chai.should();
const server = require('../server');

const {
    validCredentials
} = require('./support/factories');
const {
    withReg,
    withUser
} = require("./support/patterns");

describe('Auth', () => {
    beforeEach( async () => {
        await User.deleteMany({});
    });
    describe('POST /api/auth',() => {
        it('should authenticate valid credentials', async () => {
            let credentials = validCredentials();
            const user = await withUser();
            const res = await chai.request(server)
                .post('/api/auth')
                .send(credentials);
            await res.should.have.status(201);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('token');
            await res.body.should.have.a.property('user');
            await res.body.user.should.have.a.property('id').eql(user.id);
        });
        it('should not authenticate bad password', async () => {
            let credentials = validCredentials();
            credentials.password = 'badword';
            await withUser();
            const res = await chai.request(server)
                .post('/api/auth')
                .send(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Invalid credentials');
        });
        it('should not authenticate with missing email', (done) => {
            let credentials = validCredentials();
            delete credentials.email;
            chai.request(server)
            .post('/api/auth')
            .send(credentials)
            .end((err,res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.a.property('msg').eql('Please enter all fields');
                done();
            });
        });
        it('should not authenticate with missing password', (done) => {
            let credentials = validCredentials();
            delete credentials.password;
            chai.request(server)
            .post('/api/auth')
            .send(credentials)
            .end((err,res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.a.property('msg').eql('Please enter all fields');
                done();
            });
        });
        it('should not authenticate with unregistered email', (done) => {
            let credentials = validCredentials();
            chai.request(server)
            .post('/api/auth')
            .send(credentials)
            .end((err,res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.a.property('msg').eql('User does not exist');
                done();
            });
        });
    });
    describe('GET /api/auth/user',() => {
        it('should return user information for authenticated user', done => {
            withReg(regRes => {
                chai.request(server)
                    .get('/api/auth/user')
                    .set("x-auth-token", regRes.body.token)
                    .end((err,res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object');
                        res.body.should.have.a.property('_id').eql(regRes.body.user.id);
                        done();
                    });
            });
        });
        it('should deny for a user with an invalid token', async () => {
            await withUser();
            res = await chai.request(server)
                .get('/api/auth/user')
                .set("x-auth-token", "blahblah");
            await res.should.have.status(400)
            await res.body.should.be.a('object');
            return await res.body.should.have.a.property('msg').eql('Invalid token');
        });
        it('should deny for a user without a token', done => {
            chai.request(server)
                .get('/api/auth/user')
                .end((err,res) => {
                    res.should.have.status(401)
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('msg').eql('No token, authorization denied');
                    done();
                });
        });
    });
});