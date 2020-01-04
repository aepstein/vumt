const { factory } = require('../setup')

const Visit = require('../../models/Visit')

require('./user')

factory.define('visit', Visit, {
    name: 'Marcy',
    userId: factory.assoc('user','_id')
})