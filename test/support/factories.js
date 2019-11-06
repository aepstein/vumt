const validUser = () => { return {
    firstName: 'Bob',
    lastName: 'Marshall',
    email: 'bmarshall@example.com',
    password: 'noneofyourbusiness'
}};

const validCredentials = () => {
    let { email, password } = validUser()
    return {
        email,
        password
    }
}

module.exports = {
    validUser,
    validCredentials
}