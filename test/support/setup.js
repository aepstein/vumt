const mongoose = require('mongoose');
const server = require('../../server');

const chai = require('chai');
const should = chai.should()
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const FactoryBot = require('factory-bot');
const factory = FactoryBot.factory;
factory.setAdapter(new FactoryBot.MongooseAdapter());

module.exports = {
    chai,
    factory,
    mongoose,
    server,
    should
}