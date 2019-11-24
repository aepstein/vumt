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
            await res.body.should.have.a.property('userId').eql(auth.body.user.id);
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
            const visit = await withVisit(auth.body.user);
            res = await action(auth,visit);
            await res.should.have.status(200);
        });
    });
});