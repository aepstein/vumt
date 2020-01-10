import countries from 'i18n-iso-countries'
import locales from '../locales.js'

locales.forEach((locale) => {
    countries.registerLocale(require(`i18n-iso-countries/langs/${locale.code.substring(0,2)}.json`))
})

export default countries
