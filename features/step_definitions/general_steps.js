const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    fillByLabel,
    fillTypeaheadByLabel,
    loginAs,
    parseInput,
    shouldBeLoggedInAs,
    shouldSeeErrorWithLabel,
    shouldSeeDefinition,
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

When(/^I fill in "([^"]+)" with ("[^"]+"|today|tomorrow)$/, async (label, value) => {
    await fillByLabel(label,parseInput(value))
})

When('I fill in the {string} typeahead with {string}', async (label, value) => {
    await fillTypeaheadByLabel(label,value)
})

When('I fill in {string} with nothing', async (label) => {
    await fillByLabel(label,'')
})

When('I click the {string} button', async (label) => {
    await clickByText(label,"//button");
})

When('I click the {string} link', async (label) => {
    await clickByText(label,"//a");
})

Then('the {string} field should have an error {string}', async (label, error) => {
    await new Promise(r => setTimeout(r, 200))
    await shouldSeeErrorWithLabel(error,label)
})

Then(/I should see "([^"]+)" defined as ("[^"]+"|today|tomorrow)/, async (dt, dd) => {
    await shouldSeeDefinition(dt,parseInput(dd,true))
});
