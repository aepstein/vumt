const { Given, When, Then } = require('@cucumber/cucumber');
const {
    chooseFromSelectByLabel,
    clickByText,
    clickByXPath,
    emailShouldBeSentTo,
    emailSubjectShouldBe,
    fillByLabel,
    fillTextAreaByLabel,
    fillTypeaheadByLabel,
    formatTimeForDisplay,
    formatTimeForFill,
    loginAs,
    markByLabel,
    noSpinner,
    parseInput,
    setGeolocation,
    relativeDate,
    scrollToBottom,
    shouldBeLoggedInAs,
    shouldSeeErrorWithLabel,
    shouldSeeDefinition,
    startTypeaheadByLabel,
    takeScreenshot,
    visitPage,
    waitFor,
    waitForText,
    waitForXPath
} = require('../support/actions');

Given(/my location is "(?<lat>(-?(90|(\d|[1-8]\d)(\.\d{1,6}){0,1})))\,{1}(?<long>(-?(180|(\d|\d\d|1[0-7]\d)(\.\d{1,6}){0,1})))"/,
    async (latitude,longitude) => {
        await setGeolocation(parseFloat(latitude),parseFloat(longitude))
    }
);

When(/^I visit the "([^"]+)" page$/, visitPage);

When('I take a screenshot', async () => {
    await takeScreenshot()
})

Given('I logged in as {string}', async (email) => {
    await visitPage("home");
    await waitFor('.navbar');
    await loginAs(email);
    await shouldBeLoggedInAs(email);
});

When('I change the language to {string}', async (language) => {
    await clickByXPath('//button[contains(../@class,"language-selector")]')
    await clickByXPath(`//button[contains(.,'${language}')]`)
    await noSpinner()
})

When(/^I fill in "([^"]+)" with ("[^"]+"|today|tomorrow)$/, async (label, value) => {
    await fillByLabel(label,parseInput(value))
})

When('I fill in the {string} textarea with {string}', async (label,value) => {
    await fillTextAreaByLabel(label,value)
})

When('I choose {string} for {string}', async (choice,label) => {
    await chooseFromSelectByLabel(label,choice)
})

When('I fill in the {string} typeahead with {string}', async (label, value) => {
    await fillTypeaheadByLabel(label,value)
})

When('I click on the {string} typeahead', async (label) => {
    await startTypeaheadByLabel(label,'Ad')
})

When(/^I fill in "([^"]+)" with (now)$/,
    async (label,when) => {
        const dt = relativeDate(when)
        await fillByLabel(label,formatTimeForFill(dt))
    }
)

When(/^I fill in "([^"]+)" with (\d+) (hour|minute)s? (later|ago)$/,
    async (label,increment,unit,direction) => {
        const dt = relativeDate({increment,unit,direction})
        await fillByLabel(label,formatTimeForFill(dt))
    }
)

When('I fill in {string} with nothing', async (label) => {
    await fillByLabel(label,'')
})

When('I click the {string} button', async (label) => {
    await clickByText(label,"//button");
    await noSpinner()
})

When('I click the {string} link', async (label) => {
    await clickByText(label,"//a");
    await noSpinner()
})

When(/^I (un)?mark the "([^"]+)" checkbox$/, async (un,label) => {
    await markByLabel(label,un)
})

When('I scroll down', async () => {
    await scrollToBottom()
})

When('there is no spinner', async () => {
    await noSpinner()
})

Then('the {string} field should have an error {string}', async (label, error) => {
    await new Promise(r => setTimeout(r, 200))
    await shouldSeeErrorWithLabel(error,label)
})

Then(/I should see "([^"]+)" defined as ("[^"]+"|today|tomorrow)/, async (dt, dd) => {
    await shouldSeeDefinition(dt,parseInput(dd,true))
});

Then(/I should see "([^"]+)" defined as (now)/,
    async (dt, when) => {
    const dd = relativeDate(when)
    await shouldSeeDefinition(dt,formatTimeForDisplay(dd))
})

Then(/I should see "([^"]+)" defined as (\d+) (hour|minute)s? (later|ago)/,
    async (dt, increment, unit, direction) => {
    const dd = relativeDate({increment,unit,direction})
    await shouldSeeDefinition(dt,formatTimeForDisplay(dd))
})

Then(/^I should see "([^"]+)" in a modal$/, async (text) => {
    await waitForText(text,"//div[contains(@class,'modal-body')]")
})

Then(/^the (\d+)(?:st|nd|rd|th) option in the typeahead should contain "([^"]+)"$/, async (n,text) => {
    await waitFor(`//div[contains(@class,'rbt-menu')]/a[position()='${n}' and contains(.,'${text}')]`)
})

Then('an email should be sent to {string}', (email) => {
    emailShouldBeSentTo(email)
});

Then('the email subject should be {string}', (subject) => {
    emailSubjectShouldBe(subject)
})

Then('I should see a notice {string}', async (notice) => {
    await waitForXPath(`//div[contains(@class,'alert') and contains(.,'${notice}')]`)
})