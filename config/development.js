const key = require('./secret/gsuite.json')

module.exports = {
    mongoURI: 'mongodb://mongodb/vumt_dev',
    mongoDb: 'vumt_dev',
    jwtSecret: 'noneofyourbusiness',
    mail: require('./secret/mail')
}