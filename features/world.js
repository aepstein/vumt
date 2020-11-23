const { factory, mongoose, purgeDb, server } = require('../test/support/setup')
require('../test/support/factories')
const { setWorldConstructor } = require('@cucumber/cucumber');
const scope = require('./support/scope');

const World = function() {
  scope.host = server.host;
  scope.context = {};
  scope.factory = factory
  scope.mongoose = mongoose
  scope.purgeDb = purgeDb
  scope.server = server;
};

setWorldConstructor(World);
