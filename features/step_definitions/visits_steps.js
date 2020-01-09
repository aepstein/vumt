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

Given('I have registered a visit from {string} to {string}',
    async (originName, destinationName) => {
        await visitExists({
            origin: (scope.models.originPlace.filter(p => p.name == originName)[0]._id),
            destinations: scope.models.destinationPlace.filter(p => p.name == destinationName),
            user: scope.context.user.id
        })
    }
)

When('I delete the visit to {string}', async (visit) => {
     await clickByXPath(`//button[contains(..,'${visit}')]`)
     await waitFor(`//div[contains(@class,'visits-list') and not(contains(.//li,'${visit}'))]`)
});

When('I add a visit from {string} to {string}', async (origin,destination) => {
    await waitFor('.visits-list')
    await clickByText("Add visit",'//button')
    await waitFor('form')
    await fillTypeaheadByPlaceholder("Select your starting point",origin)
    await fillTypeaheadByPlaceholder("Select your destination(s)",destination)
    await clickByText("Add visit",'//button')
    await waitFor('.visits-list li')
});

Then(
    /^I should( not)? see my visit to "([^"]+)"$/,
    async (not,visit) => {
        await takeScreenshot()
        await shouldSeeText(".visits-list", not, visit);
});