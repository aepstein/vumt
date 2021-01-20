const path = require('path')
const {spawn} = require('child_process')
function convertAdoc (adoc) {
    return new Promise((resolve,reject) => {
        const cmd = spawn(`node`,[path.join(__dirname,'../bin/asciidoctor-convert.js')],{shell: true})
        let data = ''
        cmd.stdout.on('data', (d) => {
            data += d
        })
        cmd.stderr.on('data', (d) => {
            console.error(`stderr: ${d}`)
        })
        cmd.on('close', (code) => {
            if (code !== 0) {
                reject('Asciidoc parse failed')
            }
            else {
                resolve(data)
            }
        })
        cmd.stdin.write(adoc)
        cmd.stdin.end()
    })
}

module.exports = convertAdoc
