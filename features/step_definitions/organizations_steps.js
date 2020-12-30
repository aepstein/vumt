const { Given, When, Then } = require ('@cucumber/cucumber')
const {
    clickByXPath,
    entitiesExist,
    fillByLabel,
    scope,
    shouldSeeText,
    waitFor
} = require('../support/actions')
const organizationRowSelector = (name) => {
    return `//li[contains(.,'${name}')]`
}

Given('a organization {string} exists', async (name) => {
    await entitiesExist(1,'organization',{name})
})

Given('{int} organizations exist', async (n) => {
    await entitiesExist(n,'organization')
})

When(
    /^I click "([^"]+)" for organization "([^"]+)"$/,
    async (button,name) => {
        await waitFor('.organizations-list')
        await clickByXPath(organizationRowSelector(name)+`//button[contains(.,'${button}')]`)
    }
)
When(/^I fill in values for the organization(?: except "([^"]+)")?$/,async (except) => {
    if (except !== "Name") await fillByLabel("Name","Adirondack Trail Improvement Society")
})
Then(/^I should( not)? see organization "([^"]+)"$/, async (not,name) => {
    await waitFor('.organizations-list')
    await shouldSeeText(".organization-name", not, name)
})
Then('I wait for organization {string} to disappear', async (name) => {
    const selector = `//ul[contains(@class,'organizations-list') and not(.${organizationRowSelector(name)})]`
    await waitFor(selector)
})

Then('I should see organizations {int} through {int}', async (first, last) => {
    await waitFor(scope.context.organization.slice(first-1,last-1).map(d => organizationRowSelector(d.name)),{visible: true})
})