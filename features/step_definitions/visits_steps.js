const { Given, When, Then } = require('cucumber');
const {
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
     await clickByXPath(`//button[contains(..,'${visit}') and contains(.,"Remove")]`)
     await waitFor(`//div[contains(@class,'visits-list') and not(contains(.//li,'${visit}'))]`)
});

When(/I fill in a visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"(?: except "([^"]+)")?/,
    async (startOn,origin,destination,except) => {
        const startOnDate = relativeDate(startOn)
        await waitFor('form')
        if ( except != "Date of visit" ) await fillByLabel("Date of visit",Intl.DateTimeFormat('en-US').format(startOnDate))
        if ( except != "Starting point" ) await fillTypeaheadByPlaceholder("Select your starting point",origin)
        if ( except != "Number of people in group" ) await fillByLabel("Number of people in group",'4')
        await fillTypeaheadByPlaceholder("Select your destination(s)",destination)
});

Then(
    /^I should( not)? see my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"$/,
    async (not,startOn,origin,destination) => {
        const visit = `${Intl.DateTimeFormat('en-US').format(relativeDate(startOn))}: From ${origin} To ${destination}`
        await waitFor('.visits-list')
        await shouldSeeText(".visits-list", not, visit);
});