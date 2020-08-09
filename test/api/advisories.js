const { chai, factory, server } = require('../setup')

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
})