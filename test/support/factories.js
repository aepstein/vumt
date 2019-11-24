const validCredentials = () => {
    let { email, password } = validUser()
    return {
        email,
        password
    }
}

const validUser = (attrs={}) => { return {
    firstName: 'Bob',
    lastName: 'Marshall',
    email: 'bmarshall@example.com',
    password: 'noneofyourbusiness',
    ...attrs
}};

const validVisit = (attrs={}) => { return {
    name: 'Marcy',
    ...attrs
}};

module.exports = {
    validCredentials,
    validUser,
    validVisit
}