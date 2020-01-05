const { factory, mongoose, server } = require('../test/support/setup')
require('../test/support/factories')
const { setWorldConstructor } = require('cucumber');
const scope = require('./support/scope');

const World = function() {
  scope.host = server.host;
  scope.context = {};
  scope.factory = factory
  scope.mongoose = mongoose
  scope.server = server;
};

setWorldConstructor(World);
