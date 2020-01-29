module.exports.toLocalDate = (d) => {
    const year = `${d.getYear()+1900}`
    const month = `${(d.getMonth()+1).toString().padStart(2,'0')}` 
    const day = `${d.getDate().toString().padStart(2,'0')}`
    return `${year}-${month}-${day}`
}
