const { chai, factory, server } = require('../setup')
const { withAuth } = require('../support/patterns')
const validAdvisory = async (attrs={}) => {
    return factory.attrs('advisory',attrs)
}
const { 
    errorMustHaveRoles,
    errorNoToken,
    errorPathRequired,
} = require('../support/middlewareErrors')

describe('/api/advisories', () => {
    const genAdvisories = async () => {
        return {
            global: await factory.create('advisory', { label: 'global' })
        }
    }
    const action = async (path) => {
        const req = chai.request(server).get(path);
        return req;
    }
    describe('GET /api/advisories', () => {
        it('should return all advisories', async () => {
            const advisories = await genAdvisories()
            const res = await action('/api/advisories')
            res.should.have.status(200)
            res.body.should.be.an('array')
            res.body.map(advisory => advisory._id).should.have.members([advisories.global.id])
        })
    })
    describe('POST /api/advisories', () => {
        const action = async (advisory,auth) => {
            const res = chai.request(server).post('/api/advisories').send(advisory)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save an advisory for authorized user with valid attributes', async () => {
            const auth = await withAuth({roles:['admin']})
            const advisory = await validAdvisory()
            const res = await action(advisory,auth)
            res.should.have.status(201)
            res.body.should.be.an('object')
        })
        it('should return an error for an invalid submission', async () => {
            const auth = await withAuth({roles:['admin']})
            const advisory = await validAdvisory({label: null})
            const res = await action(advisory,auth)
            errorPathRequired(res,'label')
        })
        it('should deny an unprivileged user', async () => {
            const auth = await withAuth()
            const res = await action({},auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const res = await action({})
            await errorNoToken(res)
        })
    })
    describe('PUT /api/advisories/:advisoryId', async () => {
        const action = async (advisory,props,auth) => {
            const res = chai.request(server).put('/api/advisories/' + advisory._id).send(props)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save for authorized user with valid attributes', async () => {
            const advisory = await factory.create('advisory')
            const auth = await withAuth({roles: ['admin']})
            attr = {
                label: 'Different Advisory',
                prompt: 'And now for something completely different...'
            }
            const res = await action(advisory,attr,auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.a.property('label').eql(attr.label)
            res.body.should.have.a.property('prompt').deep.include(attr.prompt)
        })
        it('should return an error for an invalid submission', async () => {
            const advisory = await factory.create('advisory')
            const auth = await withAuth({roles: ['admin']})
            const attr = await validAdvisory({label: null})
            const res = await action(advisory,attr,auth)
            errorPathRequired(res,'label')
        })
        it('should deny an unprivileged user', async () => {
            const advisory = await factory.create('advisory')
            const auth = await withAuth()
            const res = await action(advisory,{},auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const advisory = await factory.create('advisory')
            const res = await action(advisory,{})
            await errorNoToken(res)
        })
    })
    describe('DELETE /api/advisories/:advisoryId', () => {
        const action = async (advisory,auth) => {
            const res = chai.request(server).delete('/api/advisories/' + advisory._id)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should delete for authorized user', async () => {
            const auth = await withAuth({roles:['admin']})
            const advisory = await factory.create('advisory')
            const res = await action(advisory,auth)
            res.should.have.status('200')
        })
        it('should deny an unprivileged user', async () => {
            const advisory = await factory.create('advisory')
            const auth = await withAuth()
            const res = await action(advisory,auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const advisory = await factory.create('advisory')
            const res = await action(advisory)
            await errorNoToken(res)
        })
    })
})