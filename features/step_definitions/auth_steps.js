const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    fillByLabel,
    fillTypeaheadByPlaceholder,
    loginAs,
    shouldBeLoggedInAs,
    takeScreenshot,
    userExists,
    waitFor
} = require('../support/actions');


Given('I am registered as {string}', async (email) => {
    await userExists(email);
});

When('I log in as {string}', async (email) => {
    return await loginAs(email);
});

When('I fill in a new registration for {string}', async (email) => {
    await waitFor('.navbar');
    await clickByText("Register");
    await fillByLabel("First name","Bob");
    await fillByLabel("Last name","Marshall");
    await fillByLabel("Email",email);
    await fillByLabel("Password","secret");
    await fillTypeaheadByPlaceholder("Select country","United States of America")
})

When('I register as a {string}', async (email) => {
    await fillInRegistration(email)
    await clickByText("Register","//button");
});

Then('I should be logged in as {string}', async(email) => {
    return await shouldBeLoggedInAs(email);
});