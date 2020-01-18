const assert = require('assert');
const paths = require('./paths');
const scope = require('./scope');
const selectors = require('./selectors');
var sc = 1;

const create = async (template, attrs={}) => {
	if (!(template in scope.models)) {
		scope.models[template] = []
	}
	const created = await scope.factory.create(template,attrs)
	scope.models[template].push(created)
	return created
}
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

const initPage = async () => {
	if ( scope.context.currentPage ) return
	scope.context.currentPage = await scope.browser.newPage();
	scope.context.currentPage.setViewport({ width: 1280, height: 1024 });
	scope.context.currentPage.on('error', err => {
		console.log("browser error: ",err);
	});
	scope.context.currentPage.on('pageerror', err => {
		console.log("browser pageerror: ",err);
	});
}

const visitPage = async (path) => {
	await initPage()
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
    const containsText = elementText && elementText.replace(/\s+/,' ').includes(expectedText);
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

const clearInput = async (el) => {
	// Clear out any existing value
	await el.evaluate((input) => input.value = "")
	// const inputValue = await el.evaluate((input) => {
	// 	return input.value
	// })
	// for (let i = 0; i < inputValue.length; i++) {
	// 	await el.press('Backspace');
	// }
}

const fillByLabel = async (label, fill ) => {
	const escapedText = escapeXpathString(label);
	const selector = `//input[@name=(//label[contains(text(),${escapedText})][1]/@for)]`;
	const page = scope.context.currentPage
	const el = await page.$x(selector)
	clearInput(el[0])
	await el[0].click();
	await el[0].type(fill);
};

const selectFormGroupByLabel = async (label) => {
	const escapedText = escapeXpathString(label);
	const selector = `//div[contains(@class,'form-group') and contains(.//label,${escapedText})]`
	const el = await scope.context.currentPage.$x(selector)
	return el[0]
}

const selectTypeaheadCloseByLabel = async (label) => {
	const formGroup = await selectFormGroupByLabel(label)
	const el = await formGroup.$x(`.//button[contains(@class,'rbt-close')]`)
	return el[0]
}

const selectTypeaheadInputByLabel = async (label) => {
	const formGroup = await selectFormGroupByLabel(label)
	const el = await formGroup.$x(`.//input[contains(@class,'rbt-input-main')]`)
	return el[0]
}

const fillElement = async (el, fill, clear = false ) => {
	if (clear) await clearInput(el)
	await el.click()
	await el.type(fill)
};

const fillByPlaceholder = async (label, fill, clear = false ) => {
	const escapedText = escapeXpathString(label);
	const selector = `//input[contains(@placeholder,${escapedText})]`;
	const page = scope.context.currentPage
	const el = await page.$x(selector);
	await el[0].click();
	await el[0].type(fill);
};

const fillTypeaheadByLabel = async (label, fill) => {
	const closeButton = await selectTypeaheadCloseByLabel(label)
	if (closeButton) await closeButton.click()
	const el = await selectTypeaheadInputByLabel(label)
    await fillElement(el,fill.substring(0,1))
    await new Promise(r => setTimeout(r, 200))
    await fillElement(el,fill.substring(1,2))
    await new Promise(r => setTimeout(r, 200))
	await fillElement(el,fill.substring(2,fill.length-1))
    const choice = `//a[contains(@class,'dropdown-item') and contains(.,'${fill}')]`
    await waitFor(choice)
    await clickByXPath(choice)
}

const fillTypeaheadByPlaceholder = async (placeholder, fill) => {
    const choice = `//a[contains(@class,'dropdown-item') and contains(.,'${fill}')]`
    await fillByPlaceholder(placeholder,fill.substring(0,1),true)
    await new Promise(r => setTimeout(r, 200))
    await fillByPlaceholder(placeholder,fill.substring(1,2))
    await new Promise(r => setTimeout(r, 200))
    await fillByPlaceholder(placeholder,fill.substring(2,fill.length-1))
    await waitFor(choice)
    await clickByXPath(choice)
}

const waitFor = async (selector) => {
	await scope.context.currentPage.waitFor(selector);
};

const relativeDate = (description) => {
    const relativeDate = new Date()
    switch(description) {
        case 'tomorrow':
            relativeDate.setDate(relativeDate.getDate() + 1)
			break
		default:
			relativeDate.setDate(relativeDate.getDate())
	}
	relativeDate.setHours(0,0,0,0)
	return relativeDate
}

const shouldSeeErrorWithLabel = async (error,label) => {
	await waitFor(`//div[contains(@class,'invalid-feedback') and contains(.,'${error}') and ` +
		`ancestor::div[contains(@class,'form-group') and contains(.//label,'${label}')]]`)
}

const parseInput = (input) => {
	switch (input) {
		case 'tomorrow':
		case 'today':
			return Intl.DateTimeFormat('en-US').format(relativeDate(input))
		default:
			return input.replace(/"/g,'')
	}
}

const shouldSeeDefinition = async (dt,dd) => {
	const q = `//dl/dt[contains(text(),'${dt}')]/following-sibling::dd[contains(text(),'${dd}')]`
	await waitFor(q)
}

const takeScreenshot = async () => {
	await new Promise(r => setTimeout(r, 200))
	await scope.context.currentPage.screenshot({path: `sc${sc++}.png`});
}

module.exports = {
	clickByText,
	clickByXPath,
	create,
	fillByLabel,
	fillByPlaceholder,
	fillTypeaheadByLabel,
	fillTypeaheadByPlaceholder,
	loginAs,
	parseInput,
	visitExists,
	visitPage,
	relativeDate,
	shouldBeLoggedInAs,
	shouldSee,
	shouldSeeDefinition,
	shouldSeeErrorWithLabel,
	shouldSeeText,
	takeScreenshot,
	userExists,
	waitFor,
	waitForText
}