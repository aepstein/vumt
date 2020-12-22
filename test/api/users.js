const { chai, server, factory, should } = require('../setup')
const {
    withAuth
} = require('../support/patterns')
const {
    validUser
} = require('../support/validProps');
const {
    errorMustHaveRoles,
    errorNoToken,
    errorPathRequired
} = require('../support/middlewareErrors')
const {
    times
} = require('../support/util')
describe('/api/users', () => {
    beforeEach( async () => {
        await User.deleteMany({});        
    });
    describe('GET /api/users', () => {
        let action = async (q,auth) => {
            const res = chai.request(server)
                .get(q ? q : '/api/users')
            if ( auth ) { res.set('x-auth-token',auth.body.token) }
            return res
        }
        it('should retrieve users for a user with admin role', async () => {
            const auth = await withAuth({roles:['admin']})
            const res = await action(null,auth)
            res.should.have.a.status(200)
            res.body.users.should.be.an('array')
            res.body.users.map(u => u._id).should.have.members([auth.body.user._id])
            res.body.links.should.have.property('next').null
        })
        it('should paginate for more than 10 users', async () => {
            const users = await times(10,async () => factory.create('user'))
            const auth = await withAuth({roles:['admin']})
            const res = await action(null,auth)
            res.should.have.a.status(200)
            res.body.users.should.be.an('array')
            res.body.users.length.should.eq(10)
            res.body.users.map(u => u._id).should.have.members(users.map(u => u.id))
            res.body.links.should.have.property('next').not.null
            const res2 = await action(res.body.links.next.match(/\/api.+$/)[0],auth)
            res2.body.users.map(u => u._id).should.be.an('array').have.members([auth.body.user._id])
            const res3 = await action(`/api/users?q=${users[0].firstName}`,auth)
            res3.body.links.should.have.property('next').match(new RegExp(`q=${users[0].firstName}`))
        })
        it('should filter for q=',async () => {
            const q = "needle"
            const userCreates = []
            userCreates.push(factory.create('user',{firstName: ' needle '}))
            userCreates.push(factory.create('user',{lastName: ' Needle '}))
            userCreates.push(factory.create('user',{email: 'jdoe@needle.com'}))
            const users = await Promise.all(userCreates)
            const auth = await withAuth({roles:['admin']})
            const res = await action('/api/users?q=needle',auth)
            res.should.have.a.status(200)
            const ids = res.body.users.map(u => u._id)
            ids.should.have.members(users.map(u => u.id))
        })
        it('should deny an unprivileged user',async () => {
            const auth = await withAuth()
            const res = await action(null,auth)
            errorMustHaveRoles(res,['admin'])
        })
        it('should deny an unauthenticated user', async () => {
            const res = await action()
            errorNoToken(res)
        })
    })
    describe('POST /api/users',() => {
        let action = async (user,auth) => {
            const res = chai.request(server)
                .post('/api/users')
                .send(user)
            if ( auth ) { res.set('x-auth-token',auth.body.token); }
            return res
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
            res.body.user.should.have.property('enableGeolocation').eql(true)
            res.body.should.have.property('token');
        });
        it('should not register without firstName', async () => {
            let user = validUser();
            delete user.firstName;
            res = await action(user);
            errorPathRequired(res,'firstName')
        });
        it('should not register without lastName', async () => {
            let user = validUser();
            delete user.lastName;
            res = await action(user);
            errorPathRequired(res,'lastName')
        });
        it('should not register without email', async () => {
            let user = validUser();
            delete user.email;
            res = await action(user);
            errorPathRequired(res,'email')
        });
        it('should not register without password', async () => {
            let user = validUser();
            delete user.password;
            res = await action(user);
            errorPathRequired(res,'password')
        });
        it('should not register with duplicate email', async () => {
            let user = validUser();
            const originalUser = new User(user);
            await originalUser.save();
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql(`Path \`email\` must be unique. Value: \`${user.email}\``);
        });
        it('should not register without country', async () => {
            let user = validUser();
            delete user.country;
            res = await action(user);
            errorPathRequired(res,'country')
        });
        it('should accept a valid province', async () => {
            let user = validUser({province: 'New York'});
            res = await action(user);
            await res.should.have.status(201);
            await res.body.should.be.a('object');
            await res.body.user.should.have.a.property('province').eql('New York');
        })
        it('should accept a valid postal code', async () => {
            let user = validUser({postalCode: '12943'});
            res = await action(user);
            await res.should.have.status(201);
            await res.body.should.be.a('object');
            await res.body.user.should.have.a.property('postalCode').eql('12943');
        })
        it('should accept a valid phone', async () => {
            let user = validUser({phone: '518 555 1212'});
            res = await action(user);
            await res.should.have.status(201);
            await res.body.should.be.a('object');
            await res.body.user.should.have.a.property('phone').eql('+15185551212');
        })
        it('should accept a valid enableGeolocation flag', async () => {
            let user = validUser({enableGeolocation: false})
            res = await action(user)
            await res.should.have.status(201)
            await res.body.user.should.have.a.property('enableGeolocation').eql(false)
        })
        it('should accept a valid distanceUnitOfMeasure setting', async () => {
            let user = validUser({distanceUnitOfMeasure: 'mi'})
            res = await action(user)
            await res.should.have.status(201)
            await res.body.user.should.have.a.property('distanceUnitOfMeasure').eql('mi')
        })
        it('should deny an unprivileged user who is logged in', async () => {
            const auth = await withAuth()
            res = await action(validUser(),auth)
            errorMustHaveRoles(res,['admin'])
        })
        it('should allow an admin user', async () => {
            const auth = await withAuth({roles:['admin']})
            res = await action(validUser(),auth)
            await res.should.have.status(201)
            await res.body.should.be.an('object')
        })
        it('should not allow a new user to set roles', async () => {
            res = await action(validUser({roles: ['admin']}))
            await res.should.have.status(201)
            await res.body.user.should.be.an('object')
            await res.body.user.should.have.a.property('roles').an('array').empty
        })
        it('should allow an admin user to set roles', async () => {
            const auth = await withAuth({roles:['admin']})
            res = await action(validUser({roles: ['admin']}),auth)
            await res.should.have.status(201)
            await res.body.should.be.an('object')
            await res.body.should.have.a.property('roles').members(['admin'])
        })
    });
    describe('PUT /api/users/:userId',() => {
        const action = async (auth,userProps,dUser) => {
            const user = dUser ? dUser : auth.body.user
            const res = chai.request(server)
                .put('/api/users/' + user._id)
                .send(userProps);
            if ( auth ) { res.set('x-auth-token',auth.body.token); }
            return res;
        }
        const loadUser = async (userId) => {
            return User
                .findOne({_id: userId})
        }
        it('should save with valid attributes',async () => {
            const auth = await withAuth()
            const newProps = {
                firstName: 'Herbert',
                lastName: 'Clark',
                email: 'hclark@example.com',
                enableGeolocation: false,
                password: 'adifferentpassword',
                country: 'CA',
                province: 'Quebec',
                postalCode: 'H2T 2M2'
            }
            const res = await action(auth,newProps)
            res.should.have.status(200)
            const user = await loadUser(auth.body.user._id)
            user.firstName.should.eql(newProps.firstName)
            user.lastName.should.eql(newProps.lastName)
            user.email.should.eql(newProps.email)
            user.country.should.eql(newProps.country)
            user.province.should.eql(newProps.province)
            user.postalCode.should.eql(newProps.postalCode)
            user.enableGeolocation.should.eql(newProps.enableGeolocation)
        })
        it('should fail with an invalid attribute',async () => {
            const auth = await withAuth()
            const newProps = {
                firstName: null,
                lastName: 'Clark',
                email: 'hclark@example.com',
                password: 'adifferentpassword',
                country: 'CA',
                province: 'Quebec',
                postalCode: 'H2T 2M2'
            }
            const res = await action(auth,newProps)
            res.should.have.status(400)
        })
        it('should deny with unprivileged user who is not the owner',async () => {
            const auth = await withAuth()
            const user = await factory.create('user')
            const res = await action(auth,{},user)
            res.should.have.status(401)
            res.body.should.have.a.property('code').eql('UNAUTHORIZED')
        })
        it('should allow an admin user who is not the owner', async () => {
            const auth = await withAuth({roles:['admin']})
            const user = await factory.create('user')
            const res = await action(auth,{},user)
            res.should.have.status(200)
        })
        it('should deny without authentication',async () => {
            const user = await factory.create('user')
            const res = await chai.request(server)
                .put('/api/users/' + user._id)
                .send({})
            errorNoToken(res)
        })
    })
    describe('DELETE /api/users/:userId', async () => {
        let action = async (user,auth) => {
            const res = chai.request(server)
                .delete('/api/users/' + user._id)
                .send({})
            if ( auth ) { res.set('x-auth-token',auth.body.token) }
            return res
        }
        it('should delete the user for an authorized user', async () => {
            const auth = await withAuth({roles: ['admin']})
            const user = await factory.create('user')
            const res = await action(user,auth)
            res.should.have.status(200)
            const fUser = await User.findById(user._id)
            should.not.exist(fUser)
        })
        it('should deny for unprivileged user', async () => {
            const auth = await withAuth()
            const user = await factory.create('user')
            const res = await action(user,auth)
            res.should.have.status(401)
        })
        it('should deny for unauthenticated user', async () => {
            const user = await factory.create('user')
            const res = await action(user)
            res.should.have.status(401)
        })
    })
});