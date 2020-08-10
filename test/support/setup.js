const mongoose = require('mongoose');
const server = require('../../server');

const chai = require('chai');
const should = chai.should()
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const FactoryBot = require('factory-bot');
const factory = FactoryBot.factory;
factory.setAdapter(new FactoryBot.MongooseAdapter());

const Place = require('../../models/Place')
const User = require('../../models/User')
const Visit = require('../../models/Visit');
const Advisory = require('../../models/Advisory');
const purgeDb = async () => {
    await Advisory.deleteMany({})
    await Place.deleteMany({})
    await User.deleteMany({})
    await Visit.deleteMany({})
}

module.exports = {
    chai,
    factory,
    mongoose,
    purgeDb,
    server,
    should
}