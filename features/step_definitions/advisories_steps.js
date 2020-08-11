const { Given, When, Then } = require ('cucumber')
const {
    create,
    shouldSeeText,
    waitFor
} = require('../support/actions')

Given('an advisory {string} exists', async (label) => {
    await create('advisory',{label})
})

Then(/^I should( not)? see advisory "([^"]+)"$/, async (not,name) => {
    await waitFor('.advisories-list')
    await shouldSeeText(".advisory-label", not, name)
})
