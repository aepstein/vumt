const { interactsWithMail } = require('nodemailer-stub')

const mongoose = require('mongoose');
const server = require('../../server');

const chai = require('chai');
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const FactoryBot = require('factory-bot');
const factory = FactoryBot.factory;
factory.setAdapter(new FactoryBot.MongooseAdapter());

const {
    Advisory,
    District,
    Organization,
    Place,
    Theme,
    User,
    Visit
} = require('../../models')
const purgeDb = async () => {
    await Advisory.deleteMany({})
    await District.deleteMany({})
    await Organization.deleteMany({})
    await Place.deleteMany({})
    await Theme.deleteMany({})
    await User.deleteMany({})
    await Visit.deleteMany({})
}

module.exports = {
    chai,
    expect,
    factory,
    interactsWithMail,
    mongoose,
    purgeDb,
    server,
    should
}