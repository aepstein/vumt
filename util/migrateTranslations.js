const path = require('path')
const fs = require('fs')
const interpolateTranslation = (translations,newTranslation,targetPath) => {
    if (!fs.existsSync(targetPath)) return
    const targets = require(targetPath)
    Object.keys(targets).sort().forEach((target) => {
        if (targets[target]) { 
            newTranslation[target] = targets[target]
            return
        }
        newTranslation[target] = translations[translation][target] ? translations[translation][target] : ''
    })
}
const f = (folder) => {
    fs.readdir(folder,(err,files) => {
        if (err) return
        files.forEach((file) => {
            const translations = require(path.join(folder,file))
            const lang = file.match(/^([a-z]+)\./)[1]
            Object.keys(translations).forEach((translation) => {
                const langEff = lang === 'en' ? 'en-US' : lang
                const targetPath = path.join(__dirname,'..','/client/public/locales/',langEff,`${translation}.json`)
                const newTranslation = {}
                Object.keys(translations[translation]).sort().forEach(t => {
                    newTranslation[t] = translations[translation][t]
                })
                fs.writeFile(targetPath,JSON.stringify(newTranslation,null,4),(err) => {
                    if (err) { console.log(err) }
                })
            })
        })
    })
}

f(path.join(__dirname,'..','/client/src/locales'))