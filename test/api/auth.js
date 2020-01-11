const { chai, factory, server } = require('../setup')
const {
    validCredentials
} = require('../support/validProps');
const {
    withReg
} = require("../support/patterns");

describe('/api/auth', () => {
    describe('POST /api/auth',() => {
        let action = async (credentials) => {
            return chai.request(server)
                .post('/api/auth')
                .send(credentials);
        }
        it('should authenticate valid credentials', async () => {
            const user = await factory.create('user');
            const res = await action(validCredentials(user));
            await res.should.have.status(201);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('token');
            await res.body.should.have.a.property('user');
            await res.body.user.should.have.a.property('_id').eql(user.id);
        });
        it('should not authenticate bad password', async () => {
            let credentials = validCredentials(await factory.create('user'));
            credentials.password = 'badword';
            const res = await action(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Invalid credentials');
        });
        it('should not authenticate with missing email', async () => {
            let credentials = validCredentials();
            delete credentials.email;
            const res = await action(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Please enter all fields');
        });
        it('should not authenticate with missing password', async () => {
            let credentials = validCredentials();
            delete credentials.password;
            const res = await action(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Please enter all fields');
        });
        it('should not authenticate with unregistered email', async () => {
            let credentials = validCredentials();
            const res = await action(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('User does not exist');
        });
    });
    describe('GET /api/auth/user',() => {
        const action = async (regRes) => {
            let req = chai.request(server)
                .get('/api/auth/user')
            if (regRes) { req.set("x-auth-token", regRes.body.token); }
            return req;
        }
        it('should return user information for authenticated user', async () => {
            const regRes = await withReg();
            const res = await action(regRes);
            await res.should.have.status(200)
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('_id').eql(regRes.body.user._id);
        });
        it('should deny for a user with an invalid token', async () => {
            await factory.create('user')
            res = await chai.request(server)
                .get('/api/auth/user')
                .set("x-auth-token", "blahblah");
            await res.should.have.status(400)
            await res.body.should.be.a('object');
            return await res.body.should.have.a.property('msg').eql('Invalid token');
        });
        it('should deny for a user without a token', async () => {
            res = await action(null);
            await res.should.have.status(401)
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('No token, authorization denied');
        });
    });
});