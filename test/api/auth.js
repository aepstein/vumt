const { chai, factory, server } = require('../setup')
const {
    validCredentials
} = require('../support/validProps');
const {
    withReg
} = require("../support/patterns");
const {
    errorNoToken
} = require('../support/middlewareErrors');
const { interactsWithMail } = require('nodemailer-stub')

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
            await res.body.should.have.a.property('code').eql('AUTH_INVALID_PASSWORD');
        });
        it('should not authenticate with missing email', async () => {
            let credentials = validCredentials();
            delete credentials.email;
            const res = await action(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('code').eql('AUTH_MISSING_EMAIL');
        });
        it('should not authenticate with missing password', async () => {
            let credentials = validCredentials();
            delete credentials.password;
            const res = await action(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('code').eql('AUTH_MISSING_PASSWORD');
        });
        it('should not authenticate with unregistered email', async () => {
            let credentials = validCredentials();
            const res = await action(credentials);
            await res.should.have.status(400);
            await res.body.should.be.a('object');
            await res.body.should.have.a.property('code').eql('AUTH_NO_USER');
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
            return await res.body.should.have.a.property('code').eql('AUTH_INVALID_USER_TOKEN');
        });
        it('should deny for a user without a token', async () => {
            res = await action(null);
            errorNoToken(res)
        });
    });
    describe('POST /api/auth/resetPassword/:email',() => {
        let action = async (email,query={}) => {
            return chai.request(server)
                .post('/api/auth/resetPassword/' + encodeURIComponent(email))
                .query(query)
        }
        it('should succeed for an existing user email and send an email',async () => {
            const user = await factory.create('user')
            const res = await action(user.email)
            res.should.have.status(201)
            const email = interactsWithMail.lastMail()
            email.envelope.should.have.a.property('to').have.members([user.email])
            email.should.have.a.property('subject').eql("Visitor Use Management Tool Password Reset")
        })
        it('should send an email in language directed by query parameter',async () => {
            const user = await factory.create('user')
            const res = await action(user.email,{lng: 'fr'})
            res.should.have.status(201)
            const email = interactsWithMail.lastMail()
            email.should.have.a.property('subject').eql("Réinitialisation du mot de passe du Outil de Gestion de l'Utilisation des Visiteurs")
        })
        it('should fail for unregistered email', async () => {
            const res = await action('doesnotexist@nowhere.com')
            res.should.have.status(404)
        })
    })
    describe('GET /api/auth/resetPassword/:email/:token',() => {
        let action = async (email,token) => {
            return chai.request(server)
                .get('/api/auth/resetPassword/' + encodeURIComponent(email) + '/' + token)
        }
        it('should succeed for an existing user email with valid token', async () => {
            const user = await factory.create('user')
            await user.createResetPasswordToken('localhost')
            const res = await action(user.email,user.resetPasswordTokens[0].token)
            res.should.have.status(200)
        })
        it('should fail for an expired token', async () => {
            const user = await factory.create('user')
            await user.createResetPasswordToken('localhost')
            user.resetPasswordTokens[0].expires = Date.now() - 1
            await user.save()
            const res = await action(user.email,user.resetPasswordTokens[0].token)
            res.should.have.status(401)
        })
        it('should fail for an expended token', async () => {
            const user = await factory.create('user')
            await user.createResetPasswordToken('localhost')
            user.resetPasswordTokens[0].expended = Date.now()
            await user.save()
            const res = await action(user.email,user.resetPasswordTokens[0].token)
            res.should.have.status(403)
        })
        it('should fail if no user exists', async () => {
            const user = await factory.create('user')
            const res = await action('nobody@nowhere.com',"a6b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7")
            res.should.have.status(404)
            res.body.should.have.property('code').eql('AUTH_NO_USER')
        })
        it('should fail if no token exists', async () => {
            const user = await factory.create('user')
            const res = await action(user.email,"a6b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7")
            res.should.have.status(404)
            res.body.should.have.property('code').eql('AUTH_NO_PASSWORD_RESET_TOKEN')
        })
    })
    describe('PUT /api/resetPassword/:email/:token',() => {
        let action = async (email,token,password) => {
            return chai.request(server)
                .put('/api/auth/resetPassword/' + encodeURIComponent(email) + '/' + token)
                .send({password})
        }
        it('should succeed for an existing user email with valid token', async () => {
            const user = await factory.create('user')
            await user.createResetPasswordToken('localhost')
            const res = await action(user.email,user.resetPasswordTokens[0].token,'swordfish')
            res.should.have.status(200)
        })
        it('should fail for an expired token', async () => {
            const user = await factory.create('user')
            await user.createResetPasswordToken('localhost')
            user.resetPasswordTokens[0].expires = Date.now() - 1
            await user.save()
            const res = await action(user.email,user.resetPasswordTokens[0].token,'swordfish')
            res.should.have.status(401)
        })
        it('should fail for an expended token', async () => {
            const user = await factory.create('user')
            await user.createResetPasswordToken('localhost')
            user.resetPasswordTokens[0].expended = Date.now()
            await user.save()
            const res = await action(user.email,user.resetPasswordTokens[0].token,'swordfish')
            res.should.have.status(403)
        })
        it('should fail if no user exists', async () => {
            const user = await factory.create('user')
            const res = await action('nobody@nowhere.com',"a6b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7",'swordfish')
            res.should.have.status(404)
            res.body.should.have.property('code').eql('AUTH_NO_USER')
        })
        it('should fail if no token exists', async () => {
            const user = await factory.create('user')
            const res = await action(user.email,"a6b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7",'swordfish')
            res.should.have.status(404)
            res.body.should.have.property('code').eql('AUTH_NO_PASSWORD_RESET_TOKEN')
        })
    })
});