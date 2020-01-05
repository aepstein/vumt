const { Given } = require ('cucumber')
const {
    create
} = require('../support/actions')
Given('an origin {string} exists', async (name) => {
    await create('originPlace',{name})
})
Given('a destination {string} exists', async (name) => {
    await create('destinationPlace',{name})
})