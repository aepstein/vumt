const { factory } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')

describe("District", () => {
    it("should save a valid district", async () => {
        await factory.create('district')
    })
    it("should not save without a name", async () => {
        const district = await factory.build('district',{name: null})
        await district.save().should.eventually.be.rejectedWith(ValidationError)
    })
    it("should not save without boundaries", async () => {
        const district = await factory.build('district',{boundaries: null})
        await district.save().should.eventually.be.rejectedWith(ValidationError)
    })
})