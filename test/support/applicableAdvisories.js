const { factory } = require('../setup')

async function applicableAdvisories (user) {
    const advisory = await factory.create('advisory',{label:'universal'})
    const currentAdvisory = await factory.create('currentAdvisory',{label: 'current'})
    await factory.create('pastAdvisory',{label: 'past'})
    await factory.create('futureAdvisory',{label: 'future'})
    const originAdvisory = await factory.create('originAdvisory',{label: 'origin'})
    const destinationAdvisory = await factory.create('destinationAdvisory',{label: 'destination'})
    await factory.create('farawayAdvisory',{label: 'faraway'})
    const visitProps = {
        destinations: [await factory.create('destinationPlace')]
    }
    if (user) { visitProps.user = user }
    const visit = await factory.create('visit',visitProps)
    return {
        advisories: [
            advisory.id,
            currentAdvisory.id,
            originAdvisory.id,
            destinationAdvisory.id
        ],
        visit
    }
}

const applicableAdvisoriesToAdvisories = (themes) => {
    return themes.reduce((advisories,theme) => advisories.concat(theme.advisories),[])
}

const applicableAdvisoriesToAdvisoryIds = (themes) => { 
    return applicableAdvisoriesToAdvisories(themes).map((advisory) => advisory._id)
}


module.exports = {
    applicableAdvisories,
    applicableAdvisoriesToAdvisoryIds
}