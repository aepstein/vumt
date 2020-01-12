const { chai, factory, server } = require('../setup')
const {
    validVisit
} = require('../support/validProps');
const {
    shouldDenyWithoutToken,
    withAuth
} = require("../support/patterns");

describe('/api/visits', () => {
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
            const visit = await validVisit();
            const res = await action(auth,visit);
            await res.should.have.status(201);
            await res.should.be.a('object');
            await res.body.should.have.a.property('origin').be.a('object')
            await res.body.origin.should.have.a.property('_id').be.a('string')
            await visit.origin.equals(res.body.origin._id).should.be.true
        });
        it('should save a provided destination',async () => {
            const destination = await factory.create('destinationPlace')
            const res = await action(await withAuth(),await validVisit({destinations: [{"_id": destination.id}]}))
            await res.should.have.status(201)
            res.body.destinations.map(d => d._id).should.have.members([destination.id])
        })
        it('should not save without startOn', async () => {
            const auth = await withAuth();
            let visit = await validVisit({startOn: null});
            const res = await action(auth,visit);
            await res.should.have.status(400);
            await res.body.should.have.a.property('msg').eql('Provide required fields');
        });
        it('should not save without origin', async () => {
            const auth = await withAuth();
            let visit = await validVisit();
            delete visit.origin;
            const res = await action(auth,visit);
            await res.should.have.status(400);
            await res.body.should.have.a.property('msg').eql('Provide required fields');
        });
        it('should not save without groupSize', async () => {
            const auth = await withAuth()
            let visit = await validVisit({groupSize: null})
            const res = await action(auth,visit)
            await res.should.have.status(400)
            await res.body.should.have.a.property('msg').eql('Provide required fields')
        });
        it('should deny unauthenticated user',async () => {
            const visit = await validVisit();
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
            const visit = await factory.create('visit',{user: auth.body.user._id});
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
            const visit = await factory.create('visit',{user: auth.body.user._id});
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
            const visit = await factory.create('visit',{user: auth.body.user._id})
            const otherUser = await factory.create('user',{firstName: 'George', email: 'gmarshall@example.com'});
            await factory.create('visit',{user: otherUser.id});
            res = await action(auth,auth.body.user._id);
            res.should.have.status(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].should.be.a('object');
            res.body[0].should.have.a.property('_id').eql(visit.id);
        });
    });
});