const { factory } = require('./setup')

module.exports.validCredentials = (user={}) => {
    let { email, password } = module.exports.validUser()
    return {
        email: user.email ? user.email : email,
        password
    }
}

module.exports.validPlace = async (attrs={}) => {
    return await factory.attrs('place',attrs)
}

module.exports.validUser = (attrs={}) => { return {
    firstName: 'Bob',
    lastName: 'Marshall',
    email: 'bmarshall@example.com',
    password: 'noneofyourbusiness',
    country: 'US',
    ...attrs
}};

module.exports.validVisit = async (attrs={}) => {
    attrs.user = null
    return await factory.attrs('visit',attrs)
};
