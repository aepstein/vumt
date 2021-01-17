const path = require('path')
const fs = require('fs')
const f = (folder) => {
    fs.readdir(folder,(err,files) => {
        if (err) return
        files.forEach((lang) => {
            const langDir = path.join(__dirname,'..','/client/public/locales/',lang)
            const newTranslation = {}
            let i = 0
            i++
            fs.readdir(langDir,(err,translations) => {
                if (err) return
                translations.forEach((translationFile) => {
                    switch(translationFile) {
                        case 'translation.json':
                        case 'AppNavbar.json':
                        case 'commonForms.json':
                            const translation = require(path.join(langDir,translationFile))
                            Object.keys(translation).forEach((k) => {
                                newTranslation[k] = translation[k]
                            })
                        default:
                            return
                    }
                })
                if (--i === 0) {
                    const translation = {}
                    Object.keys(newTranslation).sort().forEach((k) => {
                        translation[k] = newTranslation[k]
                    })
                    fs.writeFile(path.join(langDir,'translation.json'),JSON.stringify(translation,null,4),(err) => {
                        if (err) { console.log(err) }
                    })
                }
            })
        })
    })
}

f(path.join(__dirname,'..','/client/public/locales'))