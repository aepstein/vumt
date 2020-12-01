const config = require('config')
const mailer = require('../lib/mailer')
const { i18next } = require('../lib/i18n')

module.exports = async function(user,token,host) {
    try {
        await mailer.sendMail({
            from: config.mail.from,
            to: user.email,
            subject: i18next.t('passwordResetSubject'),
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'https://' + (config.host ? config.host : host) + '/resetPassword/' + encodeURIComponent(user.email) + '/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        })
    }
    catch(err) {
        console.log(err)
    }
}