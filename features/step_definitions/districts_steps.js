const { Given, When, Then } = require ('@cucumber/cucumber')
const {
    clickByXPath,
    create,
    fillByLabel,
    shouldSeeText,
    waitFor
} = require('../support/actions')
const districtRowSelector = (name) => {
    return `//li[contains(.,'${name}')]`
}

Given('a district {string} exists', async (name) => {
    await create('district',{name})
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