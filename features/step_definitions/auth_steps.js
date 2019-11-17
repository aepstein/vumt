const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    fillByLabel,
    shouldSeeText,
    takeScreenshot,
    waitFor
} = require('../support/actions');

When('I register as a {string}', async (string) => {
    await waitFor('.navbar');
    await clickByText("Register");
    await fillByLabel("First Name","Bob");
    await fillByLabel("Last Name","Marshall");
    await fillByLabel("Email","bmarshall@example.com");
    await fillByLabel("Password","secret");
    await clickByText("Register","//button");
});

Then('I should be logged in as {string}', async (string) => {
    await takeScreenshot();
    await waitFor("//a[contains(text(),'Logout')]");
    await shouldSeeText(".navbar",false,"Welcome, Bob");
    await shouldSeeText(".navbar",false,"Logout");
});