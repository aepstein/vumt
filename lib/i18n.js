const i18next = require('i18next')
const i18nextMiddleware = require('i18next-express-middleware')
const Backend = require('i18next-node-fs-backend')

const i18n = i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
            addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
        },
        fallbackLng: 'en-US',
        preload: ['en-US','es','fr','he'],
        saveMissing: true
    })

module.exports.i18n = i18n
module.exports.i18next = i18next
module.exports.i18nextMiddleware = i18nextMiddleware.handle(i18next)