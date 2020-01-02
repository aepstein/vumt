const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    clickByXPath,
    fillByLabel,
    shouldSeeText,
    visitExists,
    waitFor
} = require('../support/actions');
const scope = require('../support/scope');

Given('I have registered a visit to {string}',
    async (name) => visitExists({name, userId: scope.context.user.id}));

When('I delete the visit to {string}', async (visit) => {
     await clickByXPath(`//button[contains(..,'${visit}')]`)
     await waitFor(`//div[contains(@class,'visits-list') and not(contains(.//li,'${visit}'))]`)
});

When('I add a visit to {string}', async (string) => {
    await waitFor('.visits-list')
    await clickByText("Add visit",'//button')
    await waitFor('form')
    await fillByLabel("Visit",string)
    await clickByText("Add visit",'//button')
    await waitFor('.visits-list')
});

Then(
    /^I should( not)? see my visit to "([^"]+)"$/,
    async (not,visit) => {
        await shouldSeeText(".visits-list", not, visit);
});