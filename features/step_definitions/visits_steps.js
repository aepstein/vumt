const { Given, When, Then } = require('@cucumber/cucumber');
const {
    clickByXPath,
    entitiesExist,
    fillByLabel,
    fillTypeaheadByLabel,
    formatDateForFill,
    formatDateForDisplay,
    relativeDate,
    scope,
    shouldSeeText,
    visitExists,
    waitFor
} = require('../support/actions');
const visitRowSelector = (startOn,origin,destination) => {
    return `//li[contains(.,'${formatDateForDisplay(relativeDate(startOn))}') and contains(.,'${origin}') ` +
        `and contains(.,'${destination}')]`
}
const visitRowSelectorV = (v) => {
    return visitRowSelector(formatDateForDisplay(v.startOn),v.origin.name,v.destinations[0].name)
}
const visitRowText = (startOn,origin,destination) => {
    return `${formatDateForDisplay(relativeDate(startOn))}: From ${origin} To ${destination}`
}
const visitRowTextV = (v) => {
    return `${formatDateForDisplay(v.startOn)}: From ${v.origin.name} To ${v.destinations[0].name}`
}
const callVisitExists = async (startOn, originName, destinationName) => {
    return visitExists(visitAttr({startOn,originName,destinationName}))
}

var visitAttrCount = 0

const visitAttr = ({startOn, originName, destinationName}) => {
    return {
        startOn,
        origin: (scope.context.place.filter(p => p.isOrigin && p.name == originName)[0]._id),
        destinations: [scope.context.place.filter(p => p.isDestination && p.name == destinationName)[0]._id],
        user: scope.context.user[scope.context.user.length - 1].id
    }
}

Given(/I have registered a visit for (now|today|tomorrow) from "([^"]+)" to "([^"]+)"/,
    async ( startOnStr, originName, destinationName) => {
        const startOn = relativeDate(startOnStr)
        await callVisitExists(startOn, originName, destinationName)
    }
)

Given(/I have registered a visit for (\d+) (hour|minute)s? (ago|later) from "([^"]+)" to "([^"]+)"/,
    async ( increment, unit, direction, originName, destinationName) => {
        const startOn = relativeDate({unit, increment, direction})
        await callVisitExists(startOn, originName, destinationName)
    }
)

Given(/^a visit start(?:s|ed) from "([^"]+)" to "([^"]+)" (?:(now)|(\d+) (hour)s? (?:from )?(now|ago)) with (\d+) (?:person|people) and (\d+) vehicles?$/,
    async(origin,destination,when,increment,unit,direction,people,vehicles) => {
        await visitExists({
            startOn: relativeDate({when,increment,unit,direction}),
            origin: (scope.context.place.filter(p => p.isOrigin && p.name == origin)[0]._id),
            destinations: [scope.context.place.filter(p => p.isDestination && p.name == destination)[0]._id],
            groupSize: parseInt(people),
            parkedVehicles: parseInt(vehicles)
        })
    }
)

Given('I registered {int} visits from {string} to {string}', async (n, originName, destinationName) => {
    const startOn = new Date()
    const attr = () => {
        startOn.setDate(startOn.getDate() + (visitAttrCount++))
        return visitAttr({startOn: new Date(startOn),originName,destinationName})
    }
    await entitiesExist(n,'visit',attr)
})

When(
    /^I wait for my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)" to disappear$/,
    async (when,from,to) => {
        const selector = `//div[contains(@class,'visits-list') and not(.${visitRowSelector(when,from,to)})]`
        await waitFor(selector,{hidden: true})
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
        if ( except != "Date of visit" ) await fillByLabel("Date of visit",formatDateForFill(startOnDate))
        if ( except != "Start time" ) await fillByLabel("Start time",'08:00AM')
        if ( except != "Starting point" ) await fillTypeaheadByLabel("Starting point",origin)
        if ( except != "Number of people in group" ) await fillByLabel("Number of people in group",'4')
        if ( except != "Duration in nights" ) await fillByLabel("Duration in nights",'0')
        if ( except != "Number of vehicles parked at starting point" ) {
            await fillByLabel("Number of vehicles parked at starting point",'1')
        }
        await fillTypeaheadByLabel("Destinations",destination)
});

When(
    /^I click "([^"]+)" for my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"$/,
    async (button,when,from,to) => {
        await waitFor('.visits-list')
        await clickByXPath(visitRowSelector(when,from,to)+`//button[contains(text(),'${button}')]`)
    }
)

Then('I should see visits {int} through {int}', async (first, last) => {
    await waitFor(scope.context.visit.slice(first-1,last).map(v => visitRowSelectorV(v)))
})

Then(/^I should( not)? see visit (\d+)$/, async (not,i) => {
    await waitFor('.visits-list')
    await shouldSeeText(".visit-label", not, visitRowTextV(scope.context.visit[i-1]));
})

Then(
    /^I should( not)? see my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"$/,
    async (not,startOn,origin,destination) => {
        await waitFor('.visits-list')
        await shouldSeeText(".visit-label", not, visitRowText(startOn,origin,destination));
});

Then(/^I should( not)? see an applicable advisory for "([^"]+)" prompting "([^"]+)"$/, async (not,label,prompt) => {
    await waitFor('.applicable-advisories')
    if (!not) { await waitFor('.card-title') }
    await shouldSeeText(".card-title", not, label)
    await shouldSeeText(".card-text", not, prompt)
})