const assert = require('assert');
const {
    Visit
} = require('../../models');
const paths = require('./paths');
const scope = require('./scope');

let headless = false;
let slowMo = 5;

const visitExists = async (visitName) => {
    await new Visit({name: visitName}).save();
}

const visitHomepage = async () => {
	if (!scope.browser)
		scope.browser = await scope.driver.launch({ headless, slowMo });
	scope.context.currentPage = await scope.browser.newPage();
	scope.context.currentPage.setViewport({ width: 1280, height: 1024 });
	scope.context.currentPage.on('error', err => {
		console.log("browser error: ",err);
	});
	scope.context.currentPage.on('pageerror', err => {
		console.log("browser pageerror: ",err);
	});
	const url = scope.host + paths.home;
	const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	});
	return visit;
};
const shouldSeeText = async (selector, not, expectedText) => {
	const elementText = await scope.context.currentPage.$eval(selector, el => el.textContent);
    const containsText = elementText && elementText.includes(expectedText);
    const shouldContainText = not ? false : true;

	assert.strictEqual(
		containsText,
		shouldContainText,
		`Expected "${selector}" to ${shouldContainText ? 'contain' : 'not contain'} "${expectedText}" but had "${elementText}" instead`
	);
}

module.exports = {
    visitExists,
	visitHomepage,
	shouldSeeText
}