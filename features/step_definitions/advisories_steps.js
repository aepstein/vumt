const { Given, When, Then } = require ('@cucumber/cucumber')
const {
    clickByXPath,
    entitiesExist,
    fillByLabel,
    fillTypeaheadByLabel,
    formatDateForFill,
    noSpinner,
    relativeDate,
    scope,
    shouldSeeText,
    updateAdvisory,
    waitFor,
} = require('../support/actions')
const advisoryRowSelector = (label) => {
    return `//li[contains(.,'${label}')]`
}

Given('an advisory {string} exists', async (label) => {
    await entitiesExist(1,'advisory',{label})
})

Given('the advisory {string} has {string} prompt {string}', async (label, language, translation) => {
    await updateAdvisory(label,(advisory) => {
        advisory.prompts.push({language, translation})
    })
})

Given('the advisory {string} covers district {string}', async (label,district) => {
    await updateAdvisory(label,(advisory) => {
        advisory.districts.push(scope.context.district.find(d => d.name === district).id)
    })
})

Given('the advisory {string} has context {string}', async (label, context) => {
    await updateAdvisory(label,(advisory) => {
        advisory.contexts.push(context)
    })
})
Given('{int} advisories exist', async (n) => {
    await entitiesExist(n,'advisory')
})
When(
    /^I click "([^"]+)" for advisory "([^"]+)"$/,
    async (button,label) => {
        await waitFor('.advisories-list')
        await clickByXPath(advisoryRowSelector(label)+`//button[contains(.,'${button}')]`)
        await noSpinner()
    }
)
When(/^I fill in values for the advisory(?: except "([^"]+)")?$/,async (except) => {
    if (except !== "Label") await fillByLabel("Label","Stay Safe")
    if ( except !== "Start date" ) await fillByLabel("Start date",formatDateForFill(relativeDate('today')))
    if ( except !== "Start time" ) await fillByLabel("Start time",'08:00AM')
    if ( except !== "End date" ) await fillByLabel("End date",formatDateForFill(relativeDate('today')))
    if ( except !== "End time" ) await fillByLabel("End time",'09:00AM')
    if ( except !== "Districts" ) await fillTypeaheadByLabel("Districts","McIntyre Range")
    if ( except !== "Contexts" ) await fillTypeaheadByLabel("Contexts","check out")
})

Then(/^I should( not)? see advisory "([^"]+)"$/, async (not,name) => {
    await waitFor('.advisories-list')
    await shouldSeeText(".advisory-label", not, name)
})
Then('I wait for advisory {string} to disappear', async (label) => {
    const selector = `//ul[contains(@class,'advisories-list') and not(.${advisoryRowSelector(label)})]`
    await waitFor(selector)
})
Then('I should see advisories {int} through {int}', async (first, last) => {
    await waitFor(scope.context.advisory.slice(first-1,last).map(a => advisoryRowSelector(a.label)),{visible: true})
})