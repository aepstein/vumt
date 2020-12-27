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
const { times } = require('../support/util')

describe('/api/advisories', () => {
    const genAdvisories = async () => {
        return {
            global: await factory.create('advisory', { label: 'global' }),
            checkin: await factory.create('advisory', { label: 'check in only', contexts: ['checkin'] }),
            checkout: await factory.create('advisory', { label: 'check out only', contexts: ['checkout'] })
        }
    }
    describe('GET /api/advisories', () => {
        const action = async (path,options={}) => {
            const req = chai.request(server).get(path,options).query(options)
            return req;
        }
        it('should return all advisories', async () => {
            const advisories = await genAdvisories()
            const res = await action('/api/advisories')
            res.should.have.status(200)
            res.body.data.should.be.an('array')
            res.body.data.map(advisory => advisory._id).should.have.members( Object.values(advisories).map(v => v.id) )
        })
        it('should paginate for more than 10 advisories', async () => {
            const advisories = await times(11,() => factory.create('advisory'))
            const res = await action('/api/advisories')
            res.should.have.status(200)
            res.body.data.should.be.an('array')
            res.body.data.map(a => a._id).should.have.members(advisories.slice(0,10).map(a => a.id))
            res.body.links.should.have.property('next')
            res2 = await action(res.body.links.next)
            res2.should.have.status(200)
            res2.body.data.should.be.an('array')
            res2.body.data.map(a => a._id).should.have.members(advisories.slice(10,11).map(a => a.id))
        })
        it('should filter and paginate with q=', async () => {
            var i = 0
            const advisories = await times(11,() => { 
                return factory.create('advisory',{label: `needle ${i.toString().padStart(2,'0')}`})
            })
            advisories.push(await factory.create('advisory',{prompts: [{language: 'en-US', translation: 'Needle'}]}))
            advisories.push(await factory.create('advisory',{label: 'haystack'}))
            const res = await action('/api/advisories?q=needle')
            res.should.have.status(200)
            res.body.data.should.be.an('array')
            res.body.data.map(a => a._id).should.have.members(advisories.slice(0,10).map(a => a.id))
            const res2 = await action(res.body.links.next)
            res2.body.data.map(a => a._id).should.have.members(advisories.slice(10,12).map(a => a.id))
            res2.body.links.should.have.property('next').be.null
        })
    })
    describe('GET /api/advisories/applicable', () => {
        const action = async (path,options={}) => {
            const req = chai.request(server).get(path,options).query(options)
            return req;
        }
        it('should return advisories scoped to a context', async () => {
            const advisories = await genAdvisories()
            const res = await action(`/api/advisories/applicable/checkin`)
            res.body.map(a => a._id).should.have.members([advisories.global.id,advisories.checkin.id])
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
            const district = await factory.create('district')
            const advisory = await validAdvisory({
                startOn: Date(),
                endOn: Date(),
                districts: [{"_id": district.id}],
                prompts: [{language: 'en-US', translation: 'A translation.'}],
                contexts: ['register']
            })
            const res = await action(advisory,auth)
            res.should.have.status(201)
            res.body.should.be.an('object')
            Date(res.body.startOn).should.eql(Date(advisory.startOn))
            Date(res.body.endOn).should.eql(Date(advisory.endOn))
            res.body.districts.map(d => d._id).should.have.members([district.id])
            res.body.prompts[0].language.should.eql('en-US')
            res.body.contexts.should.have.members(['register'])
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
                label: 'Different Advisory'
            }
            const res = await action(advisory,attr,auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.a.property('label').eql(attr.label)
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