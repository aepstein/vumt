const { After, Before, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const puppeteerOptions = {
  // headless: false
  //	slowMo: 250,
    headless: true,
    devtools: true
}
const scope = require('./support/scope');
const {purgeDb,server,mongoose} =  require('../test/support/setup')
  
Before(async () => {
  scope.models = {}
});

BeforeAll(
  {
      timeout: 30000
  },
  async () => {
    await purgeDb()
    scope.driver = puppeteer;
    scope.server = server
    scope.mongoose = mongoose
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
    // Clear localStorage
    await scope.context.currentPage.evaluate('localStorage.clear();');
    // close the web page down
    await scope.context.currentPage.close();
    // wipe the context's currentPage value
    scope.context.currentPage = null;
    await scope.factory.cleanUp()
    await purgeDb()
  }
});

AfterAll(async () => {
  // If there is a browser window open, then close it
  if (scope.browser) await scope.browser.close();
  await scope.server.shutdown(() => console.log('\nServer is shut down'));
  await scope.mongoose.disconnect()
});