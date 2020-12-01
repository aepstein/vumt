const nodemailer = require('nodemailer')
const config = require('config')

const mailer = nodemailer.createTransport(config.mail)

module.exports = mailer