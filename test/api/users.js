const User = require('../../models/User');
const chai = require('chai');
should = chai.should();
const server = require('../../server');

const {
    validUser
} = require('../support/factories');

describe('Users', () => {
    beforeEach( async () => {
        await User.deleteMany({});        
    });
    describe('POST /api/users',() => {
        let action = async (user) => {
            return chai.request(server)
                .post('/api/users')
                .send(user);            
        }
        it('should register valid user', async () => {
            const user = validUser();
            res = await action(user);
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('user');
            res.body.user.should.have.property('_id');
            res.body.user.should.have.property('firstName').eql(user.firstName);
            res.body.user.should.have.property('lastName').eql(user.lastName);
            res.body.should.have.property('token');
        });
        it('should not register without firstName', async () => {
            let user = validUser();
            delete user.firstName;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Please enter required fields');
        });
        it('should not register without lastName', async () => {
            let user = validUser();
            delete user.lastName;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Please enter required fields');
        });
        it('should not register without email', async () => {
            let user = validUser();
            delete user.email;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Please enter required fields');
        });
        it('should not register without password', async () => {
            let user = validUser();
            delete user.password;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Please enter required fields');
        });
        it('should not register with duplicate email', async () => {
            let user = validUser();
            const originalUser = new User(user);
            await originalUser.save();
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('User already exists with that email');
        });
    });
});