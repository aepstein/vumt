const { Given, When, Then } = require('cucumber');
const {
    visitExists,
    visitHomepage,
    shouldSeeText
} = require('../support/actions');

Given('I have registered a visit to {string}', visitExists);

When('I visit the home page', visitHomepage);

Then(
    /^I should( not)? see my visit to "([^"]+)"$/,
    async (not,visit) => {
        await shouldSeeText(".visits-list", not, visit);
});