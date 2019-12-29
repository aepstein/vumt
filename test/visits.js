const {
    User,
    Visit
} = require('../models/');
const chai = require('chai');
should = chai.should();
const server = require('../server');

const {
    validVisit
} = require('./support/factories');
const {
    shouldDenyWithoutToken,
    withAuth,
    withUser,
    withVisit
} = require("./support/patterns");

describe('Visits', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Visit.deleteMany({});
    });
    describe('POST /api/visits',() => {
        let action = async (auth,visit) => {
            const res = chai.request(server)
                .post('/api/visits')
                .send(visit);
            if ( auth ) { res.set('x-auth-token',auth.body.token); }
            return res;
        }
        it('should save a valid visit',async () => {
            const auth = await withAuth();
            const visit = validVisit();
            const res = await action(auth,visit);
            await res.should.have.status(201);
            await res.should.be.a('object');
            await res.body.should.have.a.property('name').eql(visit.name);
            await res.body.should.have.a.property('userId').eql(auth.body.user._id);
        });
        it('should not save without name', async () => {
            const auth = await withAuth();
            let visit = validVisit();
            delete visit.name;
            const res = await action(auth,visit);
            await res.should.have.status(400);
            await res.body.should.have.a.property('msg').eql('Provide required fields');
        });
        it('should deny unauthenticated user',async () => {
            const visit = validVisit();
            const res = await action(null,visit);
            return await shouldDenyWithoutToken(res);
        });
    });
    describe('DELETE /api/visits', () => {
        const action = async (auth,visit) => {
            const req = chai.request(server)
                .delete('/api/visits/' + visit._id);
            if ( auth ) { req.set('x-auth-token',auth.body.token); }
            return req;
        }
        it('should delete with authorized user', async () => {
            const auth = await withAuth();
            const visit = await withVisit({userId: auth.body.user._id});
            res = await action(auth,visit);
            await res.should.have.status(200);
        });
    });
    describe('GET /api/visits', () => {
        const action = async () => {
            const req = chai.request(server)
                .get('/api/visits');
            return req;
        };
        it('should show all visits', async () => {
            const auth = await withAuth();
            const visit = await withVisit({userId: auth.body.user._id});
            res = await action();
            res.should.have.status(200);
            res.body.should.be.an('array');
            res.body[0].should.be.a('object');
            res.body[0].should.have.a.property('_id').eql(visit.id);
        })
    });
    describe('GET /api/users/:userId/visits', () => {
        const action = async (auth,userId) => {
            const req = chai.request(server)
                .get('/api/users/' + userId + '/visits');
            if ( auth ) { req.set('x-auth-token',auth.body.token); }
            return req;
        }
        it('should return only visits for the user', async () => {
            const auth = await withAuth();
            const visit = await withVisit({userId: auth.body.user._id})
            const otherUser = await withUser({firstName: 'George', email: 'gmarshall@example.com'});
            await withVisit({userId: otherUser.id});
            res = await action(auth,auth.body.user._id);
            res.should.have.status(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].should.be.a('object');
            res.body[0].should.have.a.property('_id').eql(visit.id);
        });
    });
});