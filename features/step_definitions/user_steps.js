const { Given, When, Then } = require('@cucumber/cucumber')
const {
    clickByXPath,
    entitiesExist,
    fillTypeaheadByLabel,
    noSpinner,
    scope,
    shouldSeeText,
    userExists,
    waitFor
} = require ('../support/actions')
const User = require('../../models/User')
const userRowSelector = async (email) => {
    const user = await User.findOne({email})
    return userRowSelectorSync(user)
}
const userRowSelectorSync = ({email,firstName,lastName}) => {
    return `//tr[contains(./td[4],'${firstName}') and contains(./td[5],'${lastName}') and ` +
        `contains(./td[6],'${email}')]`
}
Given(/^a(?:n)?(?: (admin))? user exists "([^"]+)" "([^"]+)" "([^"]+)"$/, async (role, firstName, lastName, email) => {
    const attr = {
        firstName,
        lastName,
        email
    }
    if (role) attr.roles = [role]
    await userExists(attr)
})

Given('{int} users exist named {string} {string}', async (n, firstName, lastName) => {
    await entitiesExist(n,'user',{firstName, lastName})
})

Then('I should see the first {int} users', async (n) => {
    await waitFor(scope.context.user.slice(0,n-1).map(u => userRowSelectorSync(u)))
})

Then('I should see users {int} through {int}', async (first,last) => {
    await waitFor(scope.context.user.slice(first-1,last-1).map(u => userRowSelectorSync(u)))
})

Then(/^I should( not)? see the \"([^"]+)\" menu$/, async (negate,menu) => {
    await shouldSeeText(`.navbar`,negate,menu)
})

When('I click {string} for user {string}', async (button, email) => {
    await waitFor('.users-list')
    const context = await userRowSelector(email)
    await clickByXPath(context+`//button[contains(text(),'${button}')]`)
    await noSpinner()
})

When(/^I fill in the "([^"]+)" typeahead with "([^"]+)" within the (\d)+(?:st|nd|rd|th) membership$/,
    async (label, value, n) => {
        const context = `//div[contains(@class,"membership") and contains(.//div/text(),'Membership ${n}')]`
        await fillTypeaheadByLabel(label,value,context)
    }
)

Then('I should see user {string}', async (email) => {
    await waitFor(await userRowSelector(email))
})

Then('I should not see user {string}', async (email) => {
    await waitFor(`//table[contains(@class,'users-list') and not(contains(text(),'${email}'))]`)
})

Then('I wait for user {string} to disappear', async (email) => {
    await waitFor(`//table[contains(@class,'users-list') and not(contains(text(),'${email}'))]`)
})

Then('I should see the user has role {string} in organization {string}', async (role, organization) => {
    await waitFor(`//table[contains(@class,'memberships')]/tbody/tr[contains(./td[1],'${organization}') and contains(./td[2],'${role}')]`)
})