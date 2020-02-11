const fs = require('fs')
const tz = require('timezones.json')

fs.writeFileSync(
    './lib/timezones.json',
    JSON.stringify([...new Set(tz.map(z => z.utc).flat().filter(v => /\//.exec(v) && !/^Etc/.exec(v)).sort())],null,2)
)

fs.copyFileSync('./lib/timezones.json','./client/src/lib/timezones.json')