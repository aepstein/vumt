const { Given, When, Then } = require ('@cucumber/cucumber')
const {
    clickByXPath,
    entitiesExist,
    fillByLabel,
    fillTypeaheadByLabel,
    scope,
    shouldSeeText,
    waitFor
} = require('../support/actions')
const organizationRowSelector = (name) => {
    return `//li[contains(.,'${name}')]`
}
const membershipRowSelector = (email,roles) => {
    const roleSelector = roles ? ` and contains(./td[5],'${roles}')` : ''
    return `//tr[contains(./td[4],'${email}')${roleSelector}]`
}

Given(/^an? organization "([^"]+)" exists$/, async (name) => {
    await entitiesExist(1,'organization',{name})
})

Given('{int} organizations exist', async (n) => {
    await entitiesExist(n,'organization')
})

const membershipExists = async (user, role, organization) => {
    const membership = {
        organization: organization.id,
        roles: [role]
    }
    user.memberships.push(membership)
    await user.save()
    if (!scope.context.membership) { scope.context.membership = [] }
    scope.context.membership.push({
        user,
        ...membership
    })
}

const membershipsExist = async (n,role,organization) => {
    await entitiesExist(n,'user')
    return Promise.all(scope.context.user.slice(scope.context.user.length-n).map((user) => {
        membershipExists(user,role,organization)
    }))
}

Given('user {string} has role {string} in organization {string}', async (email, role, organizationName) => {
    const user = scope.context.user.find((u) => u.email === email)
    const organization = scope.context.organization.find((o) => o.name === organizationName)
    await membershipExists(user,role,organization)
})

Given('{int} memberships with role {string} exist in organization {string}', async (n, role, organizationName) => {
    const organization = scope.context.organization.find((o) => o.name === organizationName)
    await membershipsExist(n,role,organization)
})

When(
    /^I click "([^"]+)" for organization "([^"]+)"$/,
    async (button,name) => {
        await waitFor('.organizations-list')
        await clickByXPath(organizationRowSelector(name)+`//button[contains(.,'${button}')]`)
    }
)
When('I click {string} for the membership of {string}', async (button,email) => {
    await waitFor('.memberships')
    await clickByXPath(membershipRowSelector(email)+`//button[contains(.,'${button}')]`)
})
When(/^I fill in values for the organization(?: except "([^"]+)")?$/,async (except) => {
    if (except !== "Name") await fillByLabel("Name","Adirondack Wilderness Advocates")
    if ( except !== "Districts" ) await fillTypeaheadByLabel("Districts","McIntyre Range")
})
Then(/^I should( not)? see organization "([^"]+)"$/, async (not,name) => {
    await waitFor('.organizations-list')
    await shouldSeeText(".organization-name", not, name)
})
Then('I wait for organization {string} to disappear', async (name) => {
    const selector = `//ul[contains(@class,'organizations-list') and not(.${organizationRowSelector(name)})]`
    await waitFor(selector)
})

Then('I should see organizations {int} through {int}', async (first, last) => {
    await waitFor(scope.context.organization.slice(first-1,last-1).map(d => organizationRowSelector(d.name)),{visible: true})
})
Then('I should see the organization has a member {string} with role {string}', async (member, role) => {
    await waitFor(membershipRowSelector(member,role))
})
Then('I should see the organization has no member {string}', async (member) => {
    await waitFor(membershipRowSelector(member),{hidden: true})
})
Then('I should see memberships {int} through {int}', async (first, last) => {
    await waitFor(
        scope.context.membership
        .slice(first-1,last-1)
        .map(m => membershipRowSelector(m.user.email,m.roles.join(','))),{visible: true}
    )
})
