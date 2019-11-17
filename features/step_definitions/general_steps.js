const { When } = require('cucumber');
const {
    visitPage,
    waitFor
} = require('../support/actions');

When(/^I visit the "([^"]+)" page$/, visitPage);

When("the page is loaded",async () => {
    await waitFor('.navbar');
});
