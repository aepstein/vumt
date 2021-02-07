const { factory, expect } = require('../setup')
const ValidationError = require('mongoose/lib/error/validation')
const District = require('../../models/District')
const { RestrictedKeyError } = require('../../lib/errors/models')

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
    describe("deleteOne()", () => {
        it("should succeed without dependencies", async () => {
            const district = await factory.create('district')
            await district.deleteOne()
            const dDistrict = await District.findOne({_id: district.id})
            expect(dDistrict).to.be.null
        })
        it("should fail if a dependent advisory exists", async () => {
            const district = await factory.create('district')
            await factory.create('advisory',{districts: [district]})
            await district.deleteOne().should.be.rejectedWith(RestrictedKeyError)
        })
    })
})