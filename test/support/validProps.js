const { factory } = require('./setup')

const validCredentials = (user={}) => {
    let { email, password } = validUser()
    return {
        email: user.email ? user.email : email,
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

const validVisit = async (attrs={}) => {
    const {
        name,
        originPlaceId
    } = await factory.attrs('visit',attrs)
    return {
        name,
        originPlaceId
    }
};

module.exports = {
    validCredentials,
    validUser,
    validVisit
}