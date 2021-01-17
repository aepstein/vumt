const path = require('path')
const fs = require('fs')
const getReferenceTranslation = (translationFile) => {
    return require(path.join(__dirname,'..','/client/public/locales/en-US',translationFile))
}
const f = (folder) => {
    fs.readdir(folder,(err,files) => {
        if (err) return
        files.forEach((lang) => {
            if (lang === 'en-US') { return }
            const langDir = path.join(__dirname,'..','/client/public/locales/',lang)
            fs.readdir(langDir,(err,translations) => {
                if (err) return
                translations.forEach((translationFile) => {
                    const refTranslation = getReferenceTranslation(translationFile)
                    const translationFilePath = path.join(langDir,translationFile)
                    const translation = require(translationFilePath)
                    const iTranslation = {}
                    const keys = [
                        ...Object.keys(refTranslation),
                        ...Object.keys(translation)
                    ].filter((v,i,s) => s.indexOf(v) === i ).sort()
                    keys.forEach((k) => {
                        iTranslation[k] = translation[k] ? translation[k] : refTranslation[k]
                    })
                    fs.writeFile(translationFilePath,JSON.stringify(iTranslation,null,4),(err) => {
                        if (err) { console.log(err) }
                    })
                })
            })
        })
    })
}

f(path.join(__dirname,'..','/client/public/locales'))