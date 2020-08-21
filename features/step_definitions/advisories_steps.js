const { Given, When, Then } = require ('cucumber')
const {
    clickByXPath,
    create,
    fillByLabel,
    formatDateForFill,
    relativeDate,
    shouldSeeText,
    waitFor
} = require('../support/actions')
const advisoryRowSelector = (label) => {
    return `//li[contains(.,'${label}')]`
}

Given('an advisory {string} exists', async (label) => {
    await create('advisory',{label})
})

When(
    /^I click "([^"]+)" for advisory "([^"]+)"$/,
    async (button,label) => {
        await waitFor('.advisories-list')
        await clickByXPath(advisoryRowSelector(label)+`//button[contains(.,'${button}')]`)
    }
)
When(/^I fill in values for the advisory(?: except "([^"]+)")?$/,async (except) => {
    if (except !== "Label") await fillByLabel("Label","Stay Safe")
    if (except !== "Prompt") await fillByLabel("Prompt","Bring a map, compass, and headlamp.")
    if ( except != "Start date" ) await fillByLabel("Start date",formatDateForFill(relativeDate('today')))
    if ( except != "Start time" ) await fillByLabel("Start time",'08:00AM')
    if ( except != "End date" ) await fillByLabel("End date",formatDateForFill(relativeDate('today')))
    if ( except != "End time" ) await fillByLabel("End time",'09:00AM')
})
Then(/^I should( not)? see advisory "([^"]+)"$/, async (not,name) => {
    await waitFor('.advisories-list')
    await shouldSeeText(".advisory-label", not, name)
})
Then('I wait for advisory {string} to disappear', async (label) => {
    const selector = `//ul[contains(@class,'advisories-list') and not(.${advisoryRowSelector(label)})]`
    await waitFor(selector)
})