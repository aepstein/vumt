const { Given, When, Then } = require('cucumber')
const {
    clickByXPath,
    shouldSeeText,
    userExists,
    waitFor
} = require ('../support/actions')
const User = require('../../models/User')
const userRowSelector = async (email) => {
    const user = await User.findOne({email})
    return `//tr[contains(./td[4],'${user.firstName}') and contains(./td[5],'${user.lastName}') and ` +
        `contains(./td[6],'${user.email}')]`
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

Then(/^I should( not)? see the \"([^"]+)\" menu$/, async (negate,menu) => {
    shouldSeeText(`.navbar`,negate,menu)
})

When('I click {string} for user {string}', async (button, email) => {
    await waitFor('.users-list')
    const context = await userRowSelector(email)
    await clickByXPath(context+`//button[contains(text(),'${button}')]`)
})

Then('I should see user {string}', async (email) => {
    await waitFor(await userRowSelector(email))
})

Then('I wait for user {string} to disappear', async (email) => {
    await waitFor(`//table[contains(@class,'users-list') and not(contains(text(),'${email}'))]`)
})