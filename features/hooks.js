// Dependencies
const { After, Before, BeforeAll, AfterAll } = require('cucumber');
const mongoose = require('../db/mongoose');
const {
  User,
  Visit
} = require('../models');
const puppeteer = require('puppeteer');
const puppeteerOptions = {
  //	headless: false,
  //	slowMo: 250,
  //	devtools: true
}
const scope = require('./support/scope');  
  
Before(async () => {
  await User.deleteMany({});
  await Visit.deleteMany({});
});

BeforeAll(
  {
    wrapperOptions: {
      timeout: 30000
    }
  },
  async () => {
    scope.driver = puppeteer;
    return scope.browser = await scope.driver.launch(puppeteerOptions);
  }
);

After(async () => {
  // Here we check if a scenario has instantiated a browser and a current page
  if (scope.context.currentPage) {
    // if it has, find all the cookies, and delete them
    const cookies = await scope.context.currentPage.cookies();
    if (cookies && cookies.length > 0) {
      await scope.context.currentPage.deleteCookie(...cookies);
    }
    // close the web page down
    await scope.context.currentPage.close();
    // wipe the context's currentPage value
    scope.context.currentPage = null;
  }
});

AfterAll(async () => {
  // If there is a browser window open, then close it
  if (scope.browser) await scope.browser.close();
  scope.server.shutdown(() => console.log('\nServer is shut down'));
  mongoose.disconnect();
});