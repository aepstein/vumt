const mongoose = require('mongoose');
const server = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

after(async () => {
    server.shutdown();
    mongoose.disconnect();
});