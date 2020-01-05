const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    clickByXPath,
    fillByLabel,
    fillByPlaceholder,
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
    await fillByPlaceholder("Select your starting point",origin.substring(0,1))
    await new Promise(r => setTimeout(r, 200))
    await fillByPlaceholder("Select your starting point",origin.substring(1,2))
    await new Promise(r => setTimeout(r, 200))
    await fillByPlaceholder("Select your starting point",origin.substring(2,origin.length-1))
    const choice = `//a[contains(@class,'dropdown-item') and contains(.,'${origin}')]`
    await waitFor(choice)
    await clickByXPath(choice)
    await clickByText("Add visit",'//button')
    await waitFor('.visits-list')
});

Then(
    /^I should( not)? see my visit to "([^"]+)"$/,
    async (not,visit) => {
        await shouldSeeText(".visits-list", not, visit);
});