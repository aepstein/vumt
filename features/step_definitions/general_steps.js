const { Given, When } = require('cucumber');
const {
    loginAs,
    shouldBeLoggedInAs,
    visitPage,
    waitFor
} = require('../support/actions');

When(/^I visit the "([^"]+)" page$/, visitPage);

When("the page is loaded",async () => {
    await waitFor('.navbar');
});

Given('I logged in as {string}', async (email) => {
    await visitPage("home");
    await waitFor('.navbar');
    await loginAs(email);
    await shouldBeLoggedInAs(email);
});