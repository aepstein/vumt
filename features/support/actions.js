const assert = require('assert');
const paths = require('./paths');
const scope = require('./scope');
const selectors = require('./selectors');
var sc = 1;

const userExists = async (email) => {
	scope.context.user = await scope.factory.create('user',{email,password: "secret"});
}
const visitExists = async (attr={}) => {
    scope.context.visit = await scope.factory.create('visit',attr);
}
const loginAs = async (email) => {
    await clickByText("Login");
    await fillByLabel("Email",email);
    await fillByLabel("Password","secret");
    await clickByText("Login","//button");
}
const visitPage = async (path) => {
	scope.context.currentPage = await scope.browser.newPage();
	scope.context.currentPage.setViewport({ width: 1280, height: 1024 });
	scope.context.currentPage.on('error', err => {
		console.log("browser error: ",err);
	});
	scope.context.currentPage.on('pageerror', err => {
		console.log("browser pageerror: ",err);
	});
	const url = scope.host + paths[path];
	const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	});
	await waitFor('.navbar')
	return visit;
};

// credit: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
// see: https://stackoverflow.com/questions/47407791/puppeteer-click-on-element-with-text
const escapeXpathString = str => {
	const splitedQuotes = str.replace(/'/g, `', "'", '`);
	return `concat('${splitedQuotes}', '')`;
};
const shouldBeLoggedInAs = async(email) => {
	await waitFor("//a[contains(text(),'Logout')]");
    await shouldSeeText(".navbar",false,"Welcome, Bob");
    await shouldSeeText(".navbar",false,"Logout");
}
const shouldSee = async (selector,context) => {
	await scope.context.currentPage.waitForXPath(selectors[context][selector]);
}
  
const shouldSeeText = async (selector, not, expectedText) => {
	const elementText = await scope.context.currentPage.$eval(selector, el => el.textContent);
    const containsText = elementText && elementText.includes(expectedText);
    const shouldContainText = not ? false : true;

	assert.strictEqual(
		containsText ? containsText : false,
		shouldContainText,
		`Expected "${selector}" to ${shouldContainText ? 'contain' : 'not contain'} "${expectedText}" but had "${elementText}" instead`
	);
}

// credit: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
// see: https://stackoverflow.com/questions/47407791/puppeteer-click-on-element-with-text
const clickByText = async (text, context = "//a") => {
	const escapedText = escapeXpathString(text);
	const selector = `${context}[contains(text(), ${escapedText})]`;
	await clickByXPath(selector)
};
const clickByXPath = async (selector) => {
	const el = await scope.context.currentPage.$x(selector);
	await el[0].click();
}
const waitForText = async (text, context = "//a") => {
	const escapedText = escapeXpathString(text);
	const selector = `${context}[contains(text(), ${escapedText})]`;
	await scope.context.currentPage.waitForXPath(selector);
};


const fillByLabel = async (label, fill ) => {
	const escapedText = escapeXpathString(label);
	const selector = `//input[@name=(//label[contains(text(),${escapedText})][1]/@for)]`;
	const page = scope.context.currentPage
	const el = await page.$x(selector);
	await el[0].click();
	await el[0].type(fill);
};

const waitFor = async (selector) => {
	await scope.context.currentPage.waitFor(selector);
};

const takeScreenshot = async () => {
	await scope.context.currentPage.screenshot({path: `sc${sc++}.png`});
}

module.exports = {
	clickByText,
	clickByXPath,
	fillByLabel,
	loginAs,
	visitExists,
	visitPage,
	shouldBeLoggedInAs,
	shouldSee,
	shouldSeeText,
	takeScreenshot,
	userExists,
	waitFor,
	waitForText
}