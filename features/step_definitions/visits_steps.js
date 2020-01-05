const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    clickByXPath,
    fillByLabel,
    fillTypeaheadByPlaceholder,
    shouldSeeText,
    takeScreenshot,
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

When('I add a visit from {string} to {string}', async (origin,destination) => {
    await waitFor('.visits-list')
    await clickByText("Add visit",'//button')
    await waitFor('form')
    await fillByLabel("Visit",destination)
    await fillTypeaheadByPlaceholder("Select your starting point",origin)
    await clickByText("Add visit",'//button')
    await waitFor('.visits-list')
});

Then(
    /^I should( not)? see my visit to "([^"]+)"$/,
    async (not,visit) => {
        await shouldSeeText(".visits-list", not, visit);
});