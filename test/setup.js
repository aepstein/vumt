const mongoose = require('mongoose');
const server = require('../server');

const chai = require('chai');
const should = chai.should()
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const FactoryBot = require('factory-bot');
const factory = FactoryBot.factory;
factory.setAdapter(new FactoryBot.MongooseAdapter());

after(async () => {
    server.shutdown();
    mongoose.disconnect();
});
afterEach(async () => {
    return factory.cleanUp()
})

module.exports = {
	chai,
	chaiHttp,
	factory,
	server,
    mongoose,
    should
};