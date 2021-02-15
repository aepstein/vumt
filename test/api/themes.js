const { chai, factory, server } = require('../setup')
const { withAuth } = require('../support/patterns')
const validTheme = async (attrs={}) => {
    return factory.attrs('theme',attrs)
}
const { 
    errorMustHaveRoles,
    errorNoToken,
    errorPathRequired,
} = require('../support/middlewareErrors')
const { times } = require('../support/util')

describe('/api/themes', () => {
    describe('GET /api/themes', () => {
        const action = async (path,options={}) => {
            const req = chai.request(server).get(path,options).query(options)
            return req;
        }
        it('should paginate for more than 10 themes', async () => {
            const themes = await times(10,() => factory.create('theme'))
            themes.push(await factory.create('theme'))
            const res = await action('/api/themes')
            res.should.have.status(200)
            res.body.data.should.be.an('array')
            res.body.data.map(a => a._id).should.have.members(themes.slice(0,10).map(a => a.id))
            res.body.links.should.have.property('next')
            res2 = await action(res.body.links.next)
            res2.should.have.status(200)
            res2.body.data.should.be.an('array')
            res2.body.data.map(a => a._id).should.have.members(themes.slice(10,11).map(a => a.id))
        })
        it('should filter and paginate with q=', async () => {
            var i = 0
            const themes = await times(10,() => {
                return factory.create('theme',{name: `needle ${(i++).toString().padStart(2,'0')}`})
            })
            themes.push(await factory.create('theme',{name: `needle ${i.toString().padStart(2,'0')}`}))
            themes.push(await factory.create('theme',{labels: [{language: 'en-US', translation: 'Needle'}]}))
            themes.push(await factory.create('theme',{name: 'haystack'}))
            const res = await action('/api/themes?q=needle')
            res.should.have.status(200)
            res.body.data.should.be.an('array')
            res.body.data.map(a => a._id).should.have.members(themes.slice(0,10).map(a => a.id))
            const res2 = await action(res.body.links.next)
            res2.body.data.map(a => a._id).should.have.members(themes.slice(10,12).map(a => a.id))
            res2.body.links.should.have.property('next').be.null
        })
    })
    describe('POST /api/themes', () => {
        const action = async (theme,auth) => {
            const res = chai.request(server).post('/api/themes').send(theme)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save an theme for authorized user with valid attributes', async () => {
            const auth = await withAuth({roles:['admin']})
            const theme = await validTheme({labels: [{language: 'en-US', translation: 'Safety'}]})
            const res = await action(theme,auth)
            res.should.have.status(201)
            res.body.should.be.an('object')
            res.body.should.have.property('name').eql(theme.name)
            res.body.should.have.property('color').eql(theme.color)
            res.body.labels[0].language.should.eql('en-US')
        })
        it('should return an error for an invalid submission', async () => {
            const auth = await withAuth({roles:['admin']})
            const theme = await validTheme({name: null})
            const res = await action(theme,auth)
            errorPathRequired(res,'name')
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
    describe('PUT /api/themes/:themeId', async () => {
        const action = async (theme,props,auth) => {
            const res = chai.request(server).put('/api/themes/' + theme._id).send(props)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should save for authorized user with valid attributes', async () => {
            const theme = await factory.create('theme')
            const auth = await withAuth({roles: ['admin']})
            attr = {
                name: 'Different Theme'
            }
            const res = await action(theme,attr,auth)
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.a.property('name').eql(attr.name)
        })
        it('should return an error for an invalid submission', async () => {
            const theme = await factory.create('theme')
            const auth = await withAuth({roles: ['admin']})
            const attr = await validTheme({name: null})
            const res = await action(theme,attr,auth)
            errorPathRequired(res,'name')
        })
        it('should deny an unprivileged user', async () => {
            const theme = await factory.create('theme')
            const auth = await withAuth()
            const res = await action(theme,{},auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const theme = await factory.create('theme')
            const res = await action(theme,{})
            await errorNoToken(res)
        })
    })
    describe('DELETE /api/themes/:themeId', () => {
        const action = async (theme,auth) => {
            const res = chai.request(server).delete('/api/themes/' + theme._id)
            if (auth) res.set('x-auth-token',auth.body.token)
            return res
        }
        it('should delete for authorized user', async () => {
            const auth = await withAuth({roles:['admin']})
            const theme = await factory.create('theme')
            const res = await action(theme,auth)
            res.should.have.status('200')
        })
        it('should deny an unprivileged user', async () => {
            const theme = await factory.create('theme')
            const auth = await withAuth()
            const res = await action(theme,auth)
            await errorMustHaveRoles(res,['admin'])
        })
        it('should deny without authentication', async() => {
            const theme = await factory.create('theme')
            const res = await action(theme)
            await errorNoToken(res)
        })
    })
})