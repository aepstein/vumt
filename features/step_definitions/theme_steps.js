const { Given, When, Then } = require ('@cucumber/cucumber')
const {
    chooseFromSelectByLabel,
    clickByXPath,
    entitiesExist,
    fillByLabel,
    scope,
    shouldSeeText,
    updateTheme,
    waitFor
} = require('../support/actions')
const themeRowSelector = (name) => {
    return `//li[contains(.,'${name}')]`
}

Given('a theme {string} exists', async (name) => {
    await entitiesExist(1,'theme',{name})
})

Given('{int} themes exist', async (n) => {
    await entitiesExist(n,'theme')
})

Given('the theme {string} has {string} label {string}', async (name, language, translation) => {
    await updateTheme(name,(theme) => {
        theme.labels.push({language, translation})
    })
})

When(
    /^I click "([^"]+)" for theme "([^"]+)"$/,
    async (button,name) => {
        await waitFor('.themes-list')
        await clickByXPath(themeRowSelector(name)+`//button[contains(.,'${button}')]`)
    }
)
When(/^I fill in values for the theme(?: except "([^"]+)")?$/,async (except) => {
    if (except !== "Name") await fillByLabel("Name","Enjoyment")
    if (except !== "Color") await chooseFromSelectByLabel("Color","info")
})
Then(/^I should( not)? see theme "([^"]+)"$/, async (not,name) => {
    await waitFor('.themes-list')
    await shouldSeeText(".theme-name", not, name)
})
Then('I wait for theme {string} to disappear', async (name) => {
    const selector = `//ul[contains(@class,'themes-list') and not(.${themeRowSelector(name)})]`
    await waitFor(selector)
})

Then('I should see themes {int} through {int}', async (first, last) => {
    await waitFor(scope.context.theme.slice(first-1,last-1).map(d => themeRowSelector(d.name)),{visible: true})
})