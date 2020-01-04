const mongoose = require('mongoose');
const server = require('../server');

const chai = require('chai');
const should = chai.should()
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const FactoryBot = require('factory-bot');
const factory = FactoryBot.factory;
factory.setAdapter(new FactoryBot.MongooseAdapter());

const User = require('../models/User');

after(async () => {
    server.shutdown();
    mongoose.disconnect();
});
afterEach(async () => {
    // Need to specifically delete users because they may not have been created by factories
    await User.deleteMany({})
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