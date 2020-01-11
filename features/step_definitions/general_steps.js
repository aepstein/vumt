const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    fillByLabel,
    loginAs,
    shouldBeLoggedInAs,
    shouldSeeErrorWithLabel,
    takeScreenshot,
    visitPage,
    waitFor
} = require('../support/actions');

When(/^I visit the "([^"]+)" page$/, visitPage);

When('I take a screenshot', async () => {
    await takeScreenshot()
})

Given('I logged in as {string}', async (email) => {
    await visitPage("home");
    await waitFor('.navbar');
    await loginAs(email);
    await shouldBeLoggedInAs(email);
});

When('I fill in {string} with {string}', async (label, value) => {
    await fillByLabel(label,value)
})

When('I fill in {string} with nothing', async (label) => {
    await fillByLabel(label,'')
})

When('I click the {string} button', async (label) => {
    await clickByText(label,"//button");
})

Then('the {string} field should have an error {string}', async (label, error) => {
    await new Promise(r => setTimeout(r, 200))
    await shouldSeeErrorWithLabel(error,label)
})
