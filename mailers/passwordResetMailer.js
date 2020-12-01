const config = require('config')
const mailer = require('../lib/mailer')

module.exports = async function(user,token,req) {
    const passwordResetLink = 'https://' + (config.host ? config.host : req.headers.host) + '/resetPassword/' + 
        encodeURIComponent(user.email) + '/' + token.token
    try {
        return await mailer.sendMail({
            from: config.mail.from,
            to: user.email,
            subject: req.t('passwordResetSubject'),
            text: `${req.t('passwordResetWhy')}\n\n` +
                `${req.t('passwordResetPrimary')}\n\n` +
                `${passwordResetLink}\n\n` +
                `${req.t('passwordResetIgnore')}\n`
        })
    }
    catch(err) {
        console.log(err)
    }
}