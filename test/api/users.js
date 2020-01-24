const { chai, server, factory } = require('../setup')
const {
    withAuth
} = require('../support/patterns')
const {
    validUser
} = require('../support/validProps');

describe('/api/users', () => {
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
            await res.body.should.have.a.property('msg').eql('Path `firstName` is required.');
        });
        it('should not register without lastName', async () => {
            let user = validUser();
            delete user.lastName;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Path `lastName` is required.');
        });
        it('should not register without email', async () => {
            let user = validUser();
            delete user.email;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Path `email` is required.');
        });
        it('should not register without password', async () => {
            let user = validUser();
            delete user.password;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Path `password` is required.');
        });
        it('should not register with duplicate email', async () => {
            let user = validUser();
            const originalUser = new User(user);
            await originalUser.save();
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql(`Error, expected \`email\` to be unique. Value: \`${user.email}\``);
        });
        it('should not register without country', async () => {
            let user = validUser();
            delete user.country;
            res = await action(user);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('msg').eql('Path `country` is required.');
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
        it('should deny with unauthorized user',async () => {
            const auth = await withAuth()
            const user = await factory.create('user')
            const res = await action(auth,{},user)
            res.should.have.status(401)
            res.body.should.have.a.property('msg').eql('User not authorized to access user')
        })
        it('should deny without authentication',async () => {
            const user = await factory.create('user')
            const res = await chai.request(server)
                .put('/api/users/' + user._id)
                .send({})
            res.should.have.status(401)
            res.body.should.have.a.property('msg').eql('No token, authorization denied')
        })
    })
});