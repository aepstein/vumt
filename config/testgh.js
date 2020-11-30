const { stubTransport } = require('nodemailer-stub')

module.exports = {
    mongoURI: 'mongodb://localhost/vumt_test',
    mongoDb: 'vumt_test',
    jwtSecret: 'noneofyourbusiness',
    test: true,
    mail: stubTransport
}
