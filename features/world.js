// Dependencies
const server = require('../');
const { setWorldConstructor } = require('cucumber');
const scope = require('./support/scope');

const World = function() {
  scope.host = server.host;
  scope.context = {};
  scope.server = server;
};

setWorldConstructor(World);
