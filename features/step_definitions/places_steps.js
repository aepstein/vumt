const { Given, When, Then } = require ('@cucumber/cucumber')
const {
    clickByXPath,
    create,
    fillByLabel,
    fillTypeaheadByLabel,
    markByLabel,
    scope,
    shouldSeeText,
    waitFor,
    entitiesExist
} = require('../support/actions')
const placeRowSelector = (name) => {
    return `//li[contains(.,'${name}')]`
}

Given(/^an? (origin|destination) "([^"]+)" exists(?: at "([^"]+)")?$/, async (type,name,coords) => {
    const params = {name}
    if (coords) {
        const [latitude,longitude] = coords.split(',')
        params['location'] = {
            type: 'Point',
            coordinates: [longitude,latitude]
        }
    }
    await entitiesExist(1,`${type}Place`,params,'place')
})
Given('{int} places exist', async (n) => {
    await entitiesExist(n,'place')
})
Given('a place {string} exists', async (name) => {
    await entitiesExist(1,'place',{name})
})
When(/^I fill in values for the place(?: except "([^"]+)")?$/,async (except) => {
    if (except !== "Name") await fillByLabel("Name","Upper Cascade Lake Launch")
    if (except !== "Latitude") await fillByLabel("Latitude","45")
    if (except !== "Longitude") await fillByLabel("Longitude","-75")
    if (except !== "Is a starting point") await markByLabel("Is a starting point")
    if (except !== "Is a destination") await markByLabel("Is a destination")
    if (except !== "Number of public parking spots") await fillByLabel("Number of public parking spots","8")
    if (except !== "Timezone") await fillTypeaheadByLabel("Timezone","America/Chicago")
})
When(
    /^I click "([^"]+)" for place "([^"]+)"$/,
    async (button,name) => {
        await waitFor('.places-list')
        await clickByXPath(placeRowSelector(name)+`//button[contains(.,'${button}')]`)
    }
)
Then(/^I should( not)? see place "([^"]+)"$/, async (not,name) => {
    await waitFor('.places-list')
    await shouldSeeText(".place-label", not, name);
})
Then('I wait for place {string} to disappear', async (name) => {
    const selector = `//ul[contains(@class,'places-list') and not(.${placeRowSelector(name)})]`
    await waitFor(selector)
})
Then('I should see places {int} through {int}', async (first, last) => {
    await waitFor(scope.context.place.slice(first-1,last-1).map(d => placeRowSelector(d.name)))
})