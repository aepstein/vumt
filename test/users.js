//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');

//Require the dev-dependencies
let chai = require('chai');
should = chai.should();
let chaiHttp = require('chai-http');
let server = require('../server');


chai.use(chaiHttp);

let validUser = () => { return {
    firstName: 'Bob',
    lastName: 'Marshall',
    email: 'bmarshall@example.com',
    password: 'noneofyourbusiness'
}};
let validCredentials = () => {
    let { email, password } = validUser()
    return {
        email,
        password
    }
}

//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => { 
           done();           
        });        
    });
    after(async () => {
        server.shutdown();
        mongoose.disconnect();
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
    describe('POST /api/auth',() => {
        let withUser = (cb) => {
            chai.request(server)
                .post('/api/users')
                .send(validUser())
                .end((err,regRes) => {
                    regRes.should.have.status(201);
                    if(err) throw err;
                    cb(regRes);
                    });
        }
        it('should authenticate valid credentials', (done) => {
            let credentials = validCredentials();
            withUser((regRes) => {
                    chai.request(server)
                    .post('/api/auth')
                    .send(credentials)
                    .end((err,res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.a.property('token');
                        res.body.should.have.a.property('user');
                        res.body.user.should.have.a.property('id').eql(regRes.body.user.id);
                        done();
                    });
            });
        });
        it('should not authenticate bad password', (done) => {
            let credentials = validCredentials();
            credentials.password = 'badword';
            withUser((regRes) => {
                    chai.request(server)
                    .post('/api/auth')
                    .send(credentials)
                    .end((err,res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.a.property('msg').eql('Invalid credentials');
                        done();
                    });
            });
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
});