const User = require('../models/User');
const chai = require('chai');
should = chai.should();
const server = require('../server');

const {
    validUser
} = require('./support/factories');

describe('Users', () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => { 
           done();           
        });        
    });
    describe('POST /api/users',() => {
        it('should register valid user', (done) => {
            let user = validUser();
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err,res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('id');
                    res.body.user.should.have.property('firstName').eql(user.firstName);
                    res.body.user.should.have.property('lastName').eql(user.lastName);
                    res.body.should.have.property('token');
                });
            done();
        });
        it('should not register without firstName', (done) => {
            let user = validUser();
            delete user.firstName;
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err,res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('msg').eql('Please enter required fields')
                });
            done();
        });
        it('should not register without lastName', (done) => {
            let user = validUser();
            delete user.lastName;
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err,res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('msg').eql('Please enter required fields')
                });
            done();
        });
        it('should not register without email', (done) => {
            let user = validUser();
            delete user.email;
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err,res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('msg').eql('Please enter required fields')
                });
            done();
        });
        it('should not register without password', (done) => {
            let user = validUser();
            delete user.password;
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err,res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.a.property('msg').eql('Please enter required fields')
                });
            done();
        });
        it('should not register with duplicate email', (done) => {
            let user = validUser();
            const originalUser = new User(user);
            originalUser.save()
                .then((user) => {
                    chai.request(server)
                    .post('/api/users')
                    .send(user)
                    .end((err,res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.a.property('msg').eql('User already exists with that email')
                    });
                    done();
                });
        });
    });
});