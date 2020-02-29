const tz = require('timezone')(require('timezone/America/New_York'))
module.exports.toLocalDate = (d) => {
    const year = `${d.getYear()+1900}`
    const month = `${(d.getMonth()+1).toString().padStart(2,'0')}` 
    const day = `${d.getDate().toString().padStart(2,'0')}`
    return `${year}-${month}-${day}`
}
module.exports.toLocalTime = (d) => {
    return tz(d,'America/New_York',"%I%M%p")
}
module.exports.fromLocalDateTimeToDate = (s) => {
    return new Date(tz(s,'America/New_York'))
}
