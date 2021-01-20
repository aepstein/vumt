const stdin = process.stdin
const stdout = process.stdout
const adoc = require('asciidoctor')()

let data = ''

stdin.setEncoding('utf8')

stdin.on('data', function (chunk) {
  data += chunk
})

stdin.on('end', function () {
  stdout.write(adoc.convert(data))
  process.exit(0)
})

stdin.on('error', console.error)