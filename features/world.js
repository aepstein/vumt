// Dependencies
const server = require('../');
const { setWorldConstructor } = require('cucumber');
const puppeteer = require('puppeteer');
const scope = require('./support/scope');

const World = function() {
  scope.host = server.host;
  scope.driver = puppeteer;
  scope.context = {};
  scope.server = server;
};

setWorldConstructor(World);
