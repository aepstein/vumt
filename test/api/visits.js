const { chai, factory, server } = require('../setup')
const {
    validVisit
} = require('../support/validProps');
const {
    withAuth
} = require("../support/patterns");
const shouldDenyUnauthorizedUser = async (res) => {
    await res.should.have.status(401);
    await res.body.should.have.a.property('msg').eql('User not authorized to access visit')
}
const {
    errorNoToken,
    errorPathRequired
} = require('../support/middlewareErrors')
const Visit = require('../../models/Visit')

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
            errorPathRequired(res,'startOn')
        });
        it('should not save without origin', async () => {
            const auth = await withAuth();
            let visit = await validVisit();
            delete visit.origin;
            const res = await action(auth,visit);
            await res.should.have.status(400);
            await res.body.should.have.a.property('msg').eql('Path `origin` is required.');
        });
        it('should not save without groupSize', async () => {
            const auth = await withAuth()
            let visit = await validVisit({groupSize: null})
            const res = await action(auth,visit)
            await res.should.have.status(400)
            await res.body.should.have.a.property('msg').eql('Path `groupSize` is required.')
        });
        it('should not save without durationNights', async () => {
            const auth = await withAuth()
            let visit = await validVisit({durationNights: null})
            const res = await action(auth,visit)
            await res.should.have.status(400)
            await res.body.should.have.a.property('msg').eql('Path `durationNights` is required.')
        })
        it('should deny unauthenticated user',async () => {
            const visit = await validVisit();
            const res = await action(null,visit);
            return  errorNoToken(res)
        });
    });
    describe('PUT /api/visits/:visitId', () => {
        let action = async (auth,visitProps,user) => {
            const visit = await factory.create('visit',{user: user ? user : auth.body.user})
            const res = chai.request(server)
                .put('/api/visits/' + visit._id)
                .send(visitProps);
            if ( auth ) { res.set('x-auth-token',auth.body.token); }
            return Promise.all([res, visit]);
        }
        let tomorrow = () => {
            const today = new Date()
            today.setDate(today.getDate() + 1)
            return today
        }
        const loadVisit = async (visit) => {
            return Visit
                .findOne({_id: visit.id})
                .populate('origin')
                .populate('destinations')
        }
        it('should update with a valid submission', async () => {
            const auth = await withAuth()
            const newOrigin = await factory.create('originPlace',{name: 'Roaring Brook Trailhead'})
            const newDestination = await factory.create('destinationPlace',{name: 'Giant Summit'})
            const newProps = {
                origin: newOrigin.id,
                destinations: [ newDestination.id ],
                startOn: tomorrow(),
                groupSize: 5
            }
            const [res, oVisit] = await action(auth,newProps)
            res.should.have.status(200)
            const visit = await loadVisit(oVisit)
            visit.origin.name.should.eql(newOrigin.name)
            visit.destinations.map(d => d.name).should.have.members([newDestination.name])
            visit.startOn.should.eql(newProps.startOn)
            visit.groupSize.should.eql(5)
        })
        it('should not update with invalid submission', async () => {
            const auth = await withAuth()
            const newProps = {
                startOn: ''
            }
            const [ res, visit ] = await action(auth,newProps)
            res.should.have.status(400)
            res.body.should.be.an('object')
            res.body.should.have.a.property('msg').eql('Path `startOn` is required.')
        })
        it('should update with valid checkedIn/checkedOut', async () => {
            const auth = await withAuth()
            const checkedIn = new Date()
            const checkedOut = new Date()
            checkedOut.setHours(checkedOut.getHours()+4)
            const newProps = {
                checkedIn,
                checkedOut
            }
            const [res, oVisit] = await action(auth,newProps)
            res.should.have.status(200)
            const visit = await loadVisit(oVisit)
            visit.should.have.a.property('checkedIn')
            visit.checkedIn.toJSON().should.eql(checkedIn.toJSON())
            visit.checkedOut.toJSON().should.eql(checkedOut.toJSON())
        })
        it('should not update if authenticated user is not visit owner', async () => {
            const auth = await withAuth()
            const user = await factory.create('user')
            const [res] = await action(auth,{},user)
            shouldDenyUnauthorizedUser(res)
        })
        it('should not update without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server)
                .put('/api/visits/' + visit._id)
                .send({});
            return errorNoToken(res)
        })
    })
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
        it('should deny with nonowner credentials', async () => {
            const auth = await withAuth()
            const visit = await factory.create('visit')
            res = await action(auth,visit)
            shouldDenyUnauthorizedUser(res)
        })
        it('should deny without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server)
                .delete('/api/visits/' + visit._id)
            return errorNoToken(res)
        })
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
    describe('GET /api/visits/:visitId', () => {
        const action = async (auth,user) => {
            const visit = await factory.create('visit',{ user: (user ? user.id : auth.body.user._id) })
            const res = chai.request(server)
                .get('/api/visits/' + visit._id)
            if ( auth ) { res.set('x-auth-token',auth.body.token) }
            return Promise.all([res, visit])
        }
        it('should get a visit with owner user credentials', async () => {
            const auth = await withAuth()
            const [ res, visit ] = await action(auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body._id.should.eql(visit.id)
        })
        it('should deny with nonowner credentials', async () => {
            const auth = await withAuth()
            const [ res, visit ] = await action(auth,await factory.create('user'))
            shouldDenyUnauthorizedUser(res)
        })
        it('should deny without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server)
                .get('/api/visits/' + visit._id)
            return errorNoToken(res)
        })
    })
    describe('GET /api/visits/:visitId/applicableAdvisories', () => {
        const action = async (auth,user) => {
            const visit = await factory.create('visit',{ user: (user ? user.id : auth.body.user._id) })
            const res = chai.request(server)
                .get('/api/visits/' + visit._id + '/applicableAdvisories')
            if ( auth ) { res.set('x-auth-token',auth.body.token) }
            return Promise.all([res, visit])
        }
        it('should return advisories applicable to all visits', async () => {
            const advisory = await factory.create('advisory')
            const auth = await withAuth()
            const [res] = await action(auth)
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body.map((v) => v._id).should.have.members([advisory.id])
        })
        it('should deny with nonowner credentials', async () => {
            const auth = await withAuth()
            const [ res, visit ] = await action(auth,await factory.create('user'))
            shouldDenyUnauthorizedUser(res)
        })
        it('should deny without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server)
                .get('/api/visits/' + visit._id)
            return errorNoToken(res)
        })
    })
});