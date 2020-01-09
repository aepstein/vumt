const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    clickByXPath,
    fillByLabel,
    fillTypeaheadByPlaceholder,
    relativeDate,
    shouldSeeText,
    takeScreenshot,
    visitExists,
    waitFor
} = require('../support/actions');
const scope = require('../support/scope');

Given(/I have registered a visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"/,
    async (startOn, originName, destinationName) => {
        await visitExists({
            startOn: relativeDate(startOn),
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

When(/I add a visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"/, async (startOn,origin,destination) => {
    const startOnDate = relativeDate(startOn)
    await waitFor('.visits-list')
    await clickByText("Add visit",'//button')
    await waitFor('form')
    await fillByLabel("Date of visit",Intl.DateTimeFormat('en-US').format(startOnDate))
    await fillTypeaheadByPlaceholder("Select your starting point",origin)
    await fillTypeaheadByPlaceholder("Select your destination(s)",destination)
    await clickByText("Add visit",'//button')
    await waitFor('.visits-list li')
});

Then(
    /^I should( not)? see my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"$/,
    async (not,startOn,origin,destination) => {
        await takeScreenshot()
        const visit = `${Intl.DateTimeFormat('en-US').format(relativeDate(startOn))}: From ${origin} To ${destination}`
        await shouldSeeText(".visits-list", not, visit);
});