const { Given, When, Then } = require ('@cucumber/cucumber')
const { factory } = require('factory-bot')
const {
    clickByXPath,
    entitiesExist,
    fillByLabel,
    scope,
    shouldSeeText,
    waitFor
} = require('../support/actions')
const districtRowSelector = (name) => {
    return `//li[contains(.,'${name}')]`
}

Given('a district {string} exists', async (name) => {
    await entitiesExist(1,'district',{name})
})

Given('{int} districts exist', async (n) => {
    await entitiesExist(n,'district')
})

When(
    /^I click "([^"]+)" for district "([^"]+)"$/,
    async (button,name) => {
        await waitFor('.districts-list')
        await clickByXPath(districtRowSelector(name)+`//button[contains(.,'${button}')]`)
    }
)
When(/^I fill in values for the district(?: except "([^"]+)")?$/,async (except) => {
    if (except !== "Name") await fillByLabel("Name","McIntyre Range")
    await clickByXPath(`//a[contains(@class,'leaflet-draw-draw-polygon')]`)
})
Then(/^I should( not)? see district "([^"]+)"$/, async (not,name) => {
    await waitFor('.districts-list')
    await shouldSeeText(".district-name", not, name)
})
Then('I wait for district {string} to disappear', async (name) => {
    const selector = `//ul[contains(@class,'districts-list') and not(.${districtRowSelector(name)})]`
    await waitFor(selector)
})

Then('I should see districts {int} through {int}', async (first, last) => {
    await waitFor(scope.context.district.slice(first-1,last-1).map(d => districtRowSelector(d.name)),{visible: true})
})