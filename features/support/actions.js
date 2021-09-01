const paths = require('./paths');
const scope = require('./scope');
const selectors = require('./selectors');
const { toLocalDate, toLocalTime, times } = require('../../test/support/util')
const Advisory = require('../../models/Advisory')
const User = require('../../models/User');
const { factory } = require('factory-bot');
var sc = 1;

const chooseFromSelectByLabel = async (label, choice) => {
	const escapedText = escapeXpathString(label);
	const selector = `//select[@name=(//label[contains(text(),${escapedText})][1]/@for)]`;
	const page = scope.context.currentPage
	const el = await page.$x(selector)
	await el[0].select(choice)
}
const clearInput = async (el) => {
	await el.evaluate((input) => input.value = "")
}
// credit: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
// see: https://stackoverflow.com/questions/47407791/puppeteer-click-on-element-with-text
const clickByText = async (text, context = "//a") => {
	const escapedText = escapeXpathString(text);
	const selector = `${context}[contains(text(), ${escapedText})]`;
	await waitForXPath(selector)
	await clickByXPath(selector)
}
const clickByXPath = async (selector) => {
	const el = await scope.context.currentPage.$x(selector);
	await el[0].click();
}
const create = async (template, attrs={}) => {
	if (!(template in scope.models)) {
		scope.models[template] = []
	}
	const created = await scope.factory.create(template,attrs)
	scope.models[template].push(created)
	return created
}
const denyGeolocation = async () => {
	const context = scope.browser.defaultBrowserContext()
	await context.overridePermissions('http://localhost:3000')
}

const emailFollowLink = async (regex) => {
	const mail = scope.mail.lastMail()
	const path = mail.content.match(regex)[0]
	return visitPath(path)
}

const emailShouldBeSentTo = (email) => {
	const mail = scope.mail.lastMail()
	mail.should.not.be.a('null')
	mail.should.have.property('to').have.members([email])
}

const emailSubjectShouldBe = (subject) => {
	const mail = scope.mail.lastMail()
	mail.should.not.be.a('null')
	mail.should.have.property('subject').eql(subject)
}

const entitiesExist = async (x,f,attr={},bucket=null) => {
	const b = bucket ? bucket : f
	if (!scope.context[b]) { scope.context[b] = [] }
	const attrs = (typeof attr === 'function') ? attr() : attr
	scope.context[b] = scope.context[b].concat(await times(x,() => factory.create(f,attrs)))
}

// credit: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
// see: https://stackoverflow.com/questions/47407791/puppeteer-click-on-element-with-text
const escapeXpathString = str => {
	const splitedQuotes = str.replace(/'/g, `', "'", '`);
	return `concat('${splitedQuotes}', '')`;
}
const fillByLabel = async (label, fill ) => {
	const escapedText = escapeXpathString(label);
	const selector = `//input[@name=(//label[contains(text(),${escapedText})][1]/@for)]`;
	const page = scope.context.currentPage
	const el = await page.$x(selector)
	clearInput(el[0])
	await el[0].click();
	await el[0].type(fill);
}
const fillByPlaceholder = async (label, fill, clear = false ) => {
	const escapedText = escapeXpathString(label);
	const selector = `//input[contains(@placeholder,${escapedText})]`;
	const page = scope.context.currentPage
	const el = await page.$x(selector);
	await el[0].click();
	await el[0].type(fill);
}
const fillElement = async (el, fill, clear = false ) => {
	if (clear) await clearInput(el)
	await el.click()
	await el.type(fill)
}
const fillTextAreaByLabel = async (label, fill ) => {
	const escapedText = escapeXpathString(label);
	const selector = `//textarea[@name=(//label[contains(text(),${escapedText})][1]/@for)]`;
	const page = scope.context.currentPage
	const el = await page.$x(selector)
	clearInput(el[0])
	await el[0].click();
	await el[0].type(fill);
}
const fillTypeaheadByLabel = async (label, fill, context) => {
	const closeButton = await selectTypeaheadCloseByLabel(label, context)
	if (closeButton) await closeButton.click()
	const el = await selectTypeaheadInputByLabel(label, context)
    await fillElement(el,fill.substring(0,1))
    await new Promise(r => setTimeout(r, 200))
    await fillElement(el,fill.substring(1,2))
    await new Promise(r => setTimeout(r, 200))
	await fillElement(el,fill.substring(2,fill.length-1))
    const choice = `//a[contains(@class,'dropdown-item') and contains(.,'${fill}')]`
    await waitFor(choice)
	await clickByXPath(choice)
}
const formatDateForDisplay = (date) => {
	const str = toLocalDate(date)
	return `${parseInt(str.substring(5,7))}/${parseInt(str.substring(8,10))}/${str.substring(0,4)}`
}
const formatDateForFill = (date) => {
	const str = toLocalDate(date)
	return `${str.substring(5,7)}/${str.substring(8,10)}/${str.substring(0,4)}`
}
const formatTimeForDisplay = (time) => {
	const str = toLocalTime(time)
	return `${parseInt(str.substring(0,2))}:${str.substring(2,4)}:00 ${str.substring(4)}`
}
const formatTimeForFill = (time) => {
	return toLocalTime(time)
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
const loginAs = async (email) => {
	await clickByText("Login");
	await noSpinner()
    await fillByLabel("Email",email);
    await fillByLabel("Password","secret");
	await clickByText("Login","//button");
	await noSpinner()
}
const markByLabel = async (label, un) => {
	const escapedText = escapeXpathString(label);
	const selector = `//label[contains(.,${escapedText})]`
	const page = scope.context.currentPage
	const el = await page.$x(selector)
	const handle = el[0]
	const checkbox = await el[0].$x('./input')
	const checked = await (await checkbox[0].getProperty('checked')).jsonValue()
	if ((un && checked) || (!un && !checked)) {
		await handle.click()
	}
}
const noSpinner = () => {
	return waitFor('.spinner-border',{hidden: true})
}
const parseInput = (input,display=false) => {
	switch (input) {
		case 'tomorrow':
		case 'today':
			if (display) return formatDateForDisplay(relativeDate(input))
			return formatDateForFill(relativeDate(input))
		default:
			return input.replace(/"/g,'')
	}
}
/*
 * Generates a datetime relative to the current datetime
 * @description: Either a string or an object with the following properties
 * For a string, use 8am local time. tomorrow will give the date exactly a day later. Otherwise, current date.
 * For an object:
 *  - when: if 'now' return current datetime
 *  - unit: the unit by which to add/subtract from current datetime
 *  - increment: the amount by which to add/subtract
 *  - direction: if 'now' add, otherwise subtract
 */
const relativeDate = (description) => {
	const relativeDate = new Date()
	if (typeof description === 'object') {
		switch(description.when) {
			case 'now':
				return relativeDate
			default:
				const unit = description.unit.charAt(0).toUpperCase() + description.unit.slice(1) + "s"
				const increment = parseInt(description.increment)
				const {direction} = description
				if (direction === 'now' || direction === 'later') {
					relativeDate[`set${unit}`](relativeDate[`get${unit}`]()+increment)
				}
				else {
					relativeDate[`set${unit}`](relativeDate[`get${unit}`]()-increment)
				}
				return relativeDate
		}
	}
    switch(description) {
        case 'tomorrow':
            relativeDate.setDate(relativeDate.getDate() + 1)
			break
		default:
			relativeDate.setDate(relativeDate.getDate())
	}
	relativeDate.setHours(8,0,0,0)
	return relativeDate
}
const scrollToBottom = async () => {
	await scope.context.currentPage.evaluate( () => {
		window.scrollBy(0,window.innerHeight)
	})
}
const selectFormGroupByLabel = async (label,context='') => {
	const escapedText = escapeXpathString(label);
	const selector = `${context}//div[contains(@class,'form-group') and contains(.//label,${escapedText})]`
	const el = await scope.context.currentPage.$x(selector)
	return el[0]
}
const selectTypeaheadCloseByLabel = async (label,context) => {
	const formGroup = await selectFormGroupByLabel(label,context)
	const el = await formGroup.$x(`.//button[contains(@class,'rbt-close')]`)
	return el[0]
}
const selectTypeaheadInputByLabel = async (label,context) => {
	const formGroup = await selectFormGroupByLabel(label,context)
	const el = await formGroup.$x(`.//input[contains(@class,'rbt-input-main')]`)
	return el[0]
}
const setGeolocation = async (latitude,longitude) => {
	const context = scope.browser.defaultBrowserContext()
	await context.overridePermissions('http://localhost:5000', ['geolocation'])
	await scope.context.currentPage.setGeolocation({latitude, longitude})  
}
const shouldBeLoggedInAs = async(email) => {
	await waitFor("//a[contains(text(),'Logout')]");
	const user = await User.findOne({email})
    await shouldSeeText(".navbar",false,`Welcome, ${user.firstName}`);
    await shouldSeeText(".navbar",false,"Logout");
}
const shouldSee = async (selector,context) => {
	await scope.context.currentPage.waitForXPath(selectors[context][selector]);
} 
const shouldSeeDefinition = async (dt,dd) => {
	const q = `//dt[contains(text(),'${dt}')]/following-sibling::*//text()[contains(.,'${dd}')]`
	await waitFor(q)
}
const shouldSeeErrorWithLabel = async (error,label) => {
	await waitFor(`//div[contains(@class,'invalid-feedback') and contains(.,'${error}') and ` +
		`ancestor::div[contains(@class,'form-group') and contains(.//label,'${label}')]]`)
}
const shouldSeeText = async (selector, not, expectedText) => {
	const elementText = await scope.context.currentPage.$eval(selector, el => el.textContent);
    const containsText = elementText && elementText.replace(/\s+/,' ')
	const shouldContainText = not ? false : true;
	if (shouldContainText) {
		return containsText.should.have.string(expectedText)
	}
	else {
		return containsText.should.not.have.string(expectedText)
	}
}
const shouldSeeTypeaheadFilledByLabel = async (label, value) => {
	const element = await selectTypeaheadInputByLabel(label)
	const valueText = await scope.context.currentPage.evaluate(el => el.value,element)
	return valueText.should.have.string(value)
}
const startTypeaheadByLabel = async (label, fill) => {
	const closeButton = await selectTypeaheadCloseByLabel(label)
	if (closeButton) await closeButton.click()
	const el = await selectTypeaheadInputByLabel(label)
	await el.click()
}
const switchByLabel = async (label) => {
	const escapedText = escapeXpathString(label);
	const selector = `//label[contains(.,${escapedText})]`
	const page = scope.context.currentPage
	const el = await page.$x(selector)
	const handle = el[0]
	await handle.click()
}
const takeScreenshot = async () => {
	await new Promise(r => setTimeout(r, 200))
	await scope.context.currentPage.screenshot({path: `sc${sc++}.png`});
}
const updateAdvisory = async (label,update) => {
	const advisory = await Advisory.findOne({label})
	update(advisory)
	await advisory.save()
}
const updateTheme = async (name,update) => {
	const theme = await Theme.findOne({name})
	update(theme)
	await theme.save()
}
const userExists = async (attr) => {
	await entitiesExist(1,'user',{password: "secret",...attr})
}
const visitExists = async (attr={}) => {
	await entitiesExist(1,'visit',attr)
}
const visitPage = async (page) => {
	await visitPath(paths[page])
	await noSpinner()
}
const visitPath = async (path) => {
	await initPage()
	const url = scope.host + path;
	const visit = await scope.context.currentPage.goto(url);
	await waitFor('.navbar')
	return visit;
}
const waitForText = async (text, context = "//a") => {
	const escapedText = escapeXpathString(text);
	const selector = `${context}[contains(text(), ${escapedText})]`;
	await scope.context.currentPage.waitForXPath(selector);
}
const waitFor = async (selector,options={}) => {
	if (Array.isArray(selector)) {
		const tests = selector.map((s) => {
			return waitFor(s,options)
		})
		return Promise.all(tests)
	}
	if (selector.match(/^\/\//)) {
		return scope.context.currentPage.waitForXPath(selector,options)
	}
	else {
		return scope.context.currentPage.waitForSelector(selector,options)
	}
}
const waitForXPath = async (selector,options={}) => {
	return scope.context.currentPage.waitForXPath(selector,options)
}

module.exports = {
	chooseFromSelectByLabel,
	clickByText,
	clickByXPath,
	create,
	denyGeolocation,
	emailFollowLink,
	emailShouldBeSentTo,
	emailSubjectShouldBe,
	entitiesExist,
	fillByLabel,
	fillByPlaceholder,
	fillTextAreaByLabel,
	fillTypeaheadByLabel,
	formatDateForFill,
	formatDateForDisplay,
	formatTimeForDisplay,
	formatTimeForFill,
	loginAs,
	markByLabel,
	noSpinner,
	parseInput,
	visitExists,
	visitPage,
	visitPath,
	relativeDate,
	scope,
	scrollToBottom,
	setGeolocation,
	shouldBeLoggedInAs,
	shouldSee,
	shouldSeeDefinition,
	shouldSeeErrorWithLabel,
	shouldSeeText,
    shouldSeeTypeaheadFilledByLabel,
	startTypeaheadByLabel,
	switchByLabel,
	takeScreenshot,
	updateAdvisory,
	updateTheme,
	userExists,
	waitFor,
	waitForText,
	waitForXPath
}