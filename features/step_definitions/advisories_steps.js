const { Given, When, Then } = require ('cucumber')
const {
    clickByXPath,
    create,
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

Then(/^I should( not)? see advisory "([^"]+)"$/, async (not,name) => {
    await waitFor('.advisories-list')
    await shouldSeeText(".advisory-label", not, name)
})
