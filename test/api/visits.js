const { chai, factory, server } = require('../setup')
const {
    validVisit
} = require('../support/validProps');
const {
    withAuth
} = require("../support/patterns");
const { 
    times
} = require('../support/util')
const shouldDenyUnauthorizedUser = async (res) => {
    await res.should.have.status(403);
    await res.body.should.have.a.property('code').eql('UNAUTHORIZED')
}
const {
    errorNoToken,
    errorMustHaveRoles,
    errorPathRequired
} = require('../support/middlewareErrors')
const {
    applicableAdvisories,
    applicableAdvisoriesToAdvisoryIds
} = require('../support/applicableAdvisories')
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
            return shouldDenyUnauthorizedUser(res)
        })
        it('should not update without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server)
                .put('/api/visits/' + visit._id)
                .send({});
            return errorNoToken(res)
        })
    })
    describe('POST /api/visits/cancelled/:visitId', () => {
        const action = async (visit,auth) => {
            const req = chai.request(server).post(`/api/visits/cancelled/${visit._id}`)
            if (auth) { req.set('x-auth-token',auth.body.token) }
            return req
        }
        it('should cancel with an authorized user', async () => {
            const auth = await withAuth()
            const visit = await factory.create('visit',{user: auth.body.user._id})
            res = await action(visit,auth)
            res.should.have.status(200)
            const rVisit = await Visit.findOne({_id: visit.id})
            rVisit.should.have.property('cancelled').not.null
        })
        it('should not cancel an already cancelled visit', async () => {
            const auth = await withAuth()
            const visit = await factory.create('visit',{user: auth.body.user._id, cancelled: Date.now()})
            res = await action(visit,auth)
            res.should.have.status(409)
        })
        it('should deny with nonowner credentials', async () => {
            const auth = await withAuth()
            const visit = await factory.create('visit')
            res = await action(visit,auth)
            return shouldDenyUnauthorizedUser(res)
        })
        it('should deny without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server).delete(`/api/visits/cancel/${visit._id}`)
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
            return shouldDenyUnauthorizedUser(res)
        })
        it('should deny without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server)
                .delete('/api/visits/' + visit._id)
            return errorNoToken(res)
        })
    });
    describe('GET /api/visits', () => {
        let action = async (path,auth=null) => {
            const res = chai.request(server)
                .get(path)
            if (auth) { res.set('x-auth-token',auth.body.token) }
            return res
        }
        const path = '/api/visits'
        it('should show all uncancelled visits or cancelled', async () => {
            const auth = await withAuth({roles:['admin']})
            const visit = await factory.create('visit',{user: auth.body.user._id});
            const cVisit = await factory.create('visit',{cancelled: Date.now(), user: auth.body.user._id});
            res = await action(path,auth)
            res.should.have.status(200);
            res.body.data.should.be.an('array');
            res.body.data[0].should.be.a('object');
            res.body.data[0].should.have.a.property('_id').eql(visit.id);
            res2 = await action(`${path}/cancelled`,auth)
            res2.should.have.status(200)
            res2.body.data.should.be.an('array')
            res2.body.data.map(v => v._id).should.have.members([cVisit.id])
        })
        it('should paginate', async () => {
            const auth = await withAuth({roles:['admin']})
            var i = 0
            var date = new Date()
            const visits = await times(11,async () => {
                date.setDate(date.getDate()+(i++))
                return factory.create('visit',{startOn: new Date(date)})
            })
            const res = await action(path,auth)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(v => v._id).should.have.members(visits.reverse().slice(0,10).map(v => v.id))
            res2 = await action(res.body.links.next,auth)
            res2.body.data.map(v => v._id).should.have.members(visits.slice(10,11).map(v => v.id))
        })
        it('should paginate with q=', async () => {
            const auth = await withAuth({roles:['admin']})
            var i = 0
            var date = new Date()
            const needleOrigin = await factory.create('originPlace',{name: 'needle'})
            const needleDestination = await factory.create('destinationPlace',{name: 'Needle'})
            const needleUserFirst = await factory.create('user',{firstName: 'needle'})
            const needleUserLast = await factory.create('user',{lastName: 'needle'})
            const needleDestinationVisit = await factory.create('visit',{destinations:[needleDestination.id]})
            const needleUserFirstVisit = await factory.create('visit',{user: needleUserFirst.id})
            const needleUserLastVisit = await factory.create('visit',{user: needleUserLast.id})
            const visits = await times(11,async () => {
                date.setDate(date.getDate()+(i++))
                return factory.create('visit',{startOn: new Date(date), origin: needleOrigin.id})
            })
            const outVisit = await factory.create('visit')
            const res = await action(`${path}?q=needle`,auth)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(v => v._id).should.have.members(visits.reverse().slice(0,10).map(v => v.id))
            res2 = await action(res.body.links.next,auth)
            res2.body.data.map(v => v._id).should.have.members(visits.slice(10,11).map(v => v.id)
                .concat([needleDestinationVisit.id,needleUserFirstVisit.id,needleUserLastVisit.id]))
        })
        it('should deny unprivileged user', async () => {
            const auth = await withAuth()
            res = await action(path,auth)
            return errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async () => {
            res = await action(path)
            return errorNoToken(res)
        })
    });
    describe('GET /api/users/:userId/visits', () => {
        const path = (userId) => {
            return '/api/users/' + userId + '/visits'
        }
        const action = async (path,auth=null) => {
            const req = chai.request(server)
                .get(path);
            if ( auth ) { req.set('x-auth-token',auth.body.token); }
            return req;
        }
        it('should return only visits for the user', async () => {
            const auth = await withAuth();
            const visit = await factory.create('visit',{user: auth.body.user._id})
            const otherUser = await factory.create('user',{firstName: 'George', email: 'gmarshall@example.com'});
            await factory.create('visit',{user: otherUser.id});
            res = await action(path(auth.body.user._id),auth);
            res.should.have.status(200);
            res.body.should.have.property('data').be.an('array');
            res.body.data.should.have.lengthOf(1);
            res.body.data[0].should.be.a('object');
            res.body.data[0].should.have.a.property('_id').eql(visit.id);
        })
        it('should paginate', async () => {
            const auth = await withAuth()
            var i = 0
            var date = new Date()
            const visits = await times(11,async () => {
                date.setDate(date.getDate()+(i++))
                return factory.create('visit',{startOn: new Date(date),user: auth.body.user._id})
            })
            const res = await action(path(auth.body.user._id),auth)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(v => v._id).should.have.members(visits.reverse().slice(0,10).map(v => v.id))
            res2 = await action(res.body.links.next,auth)
            res2.body.data.map(v => v._id).should.have.members(visits.slice(10,11).map(v => v.id))
        })
        it('should paginate with q=', async () => {
            const auth = await withAuth()
            const user = auth.body.user._id
            var i = 0
            var date = new Date()
            const needleOrigin = await factory.create('originPlace',{name: 'needle'})
            const needleDestination = await factory.create('destinationPlace',{name: 'Needle'})
            const needleDestinationVisit = await factory.create('visit',{destinations:[needleDestination.id],user})
            const visits = await times(11,async () => {
                date.setDate(date.getDate()+(i++))
                return factory.create('visit',{startOn: new Date(date), origin: needleOrigin.id,user})
            })
            // Create one more visit that should not appear because it's not associated with the user
            await factory.create('visit',{origin: needleOrigin.id})
            await factory.create('visit',{user})
            const res = await action(`${path(user)}?q=needle`,auth)
            res.body.should.have.property('data').be.an('array')
            res.body.data.map(v => v._id).should.have.members(visits.reverse().slice(0,10).map(v => v.id))
            res2 = await action(res.body.links.next,auth)
            res2.body.data.map(v => v._id).should.have.members(visits.slice(10,11).map(v => v.id)
                .concat([needleDestinationVisit.id]))
        })
        it('should deny for unauthorized user', async () => {
            const auth = await withAuth()
            const otherUser = await factory.create('user')
            const res = await action(path(otherUser.id),auth)
            return shouldDenyUnauthorizedUser(res)
        })
        it('should deny unauthenticated user', async () => {
            const auth = await withAuth()
            const res = await action(path(auth.body.user._id))
            return errorNoToken(res)
        })
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
            return shouldDenyUnauthorizedUser(res)
        })
        it('should deny without authentication',async () => {
            const visit = await factory.create('visit')
            const res = await chai.request(server)
                .get('/api/visits/' + visit._id)
            return errorNoToken(res)
        })
    })
    describe('GET /api/visits/:visitId/applicableAdvisories/:advisoryContext', () => {
        const action = async (auth,user,context='checkin') => {
            const {visit,advisories} = await applicableAdvisories(user ? user.id : (auth ? auth.body.user._id : null))
            const contextual = await factory.create('advisory',{contexts:['checkin']})
            await factory.create('advisory',{contexts:['checkout']})
            advisories.push(contextual.id)
            const res = chai.request(server)
                .get('/api/visits/' + visit._id + '/applicableAdvisories/' + context)
            if ( auth ) { res.set('x-auth-token',auth.body.token) }
            return {res: await res, visit, advisories}
        }
        it('should return advisories applicable to visit', async () => {
            const auth = await withAuth()
            const {res,advisories} = await action(auth)
            res.should.have.status(200)
            res.body.should.be.an('array')
            applicableAdvisoriesToAdvisoryIds(res.body).should.have.members(advisories)
        })
        it('should deny with nonowner credentials', async () => {
            const auth = await withAuth()
            const {res} = await action(auth,await factory.create('user'))
            return shouldDenyUnauthorizedUser(res)
        })
        it('should deny without authentication',async () => {
            const {res} = await action()
            return errorNoToken(res)
        })
    })
});