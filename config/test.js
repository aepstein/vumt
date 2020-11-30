const { stubTransport } = require('nodemailer-stub')

module.exports = {
    mongoURI: 'mongodb://mongodb/vumt_test',
    mongoDb: 'vumt_test',
    jwtSecret: 'noneofyourbusiness',
    test: true,
    mail: stubTransport
}
