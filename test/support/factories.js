const validCredentials = () => {
    let { email, password } = validUser()
    return {
        email,
        password
    }
}

const validPlaceOrigin = (attrs={}) => { return {
    name: "Adirondack Loj",
    location: {
        type: 'Point',
        coordinates: [44.183102,-73.963584]
    },
    isOrigin: true,
    parkingCapacity: 100
}}

const validPlaceDestination = (attrs={}) => { return {
    name: "Marcy Summit",
    location: {
        type: 'Point',
        coordinates: [44.112744,-73.923267]
    },
    isOrigin: false,
    parkingCapacity: 0
}}

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
    validPlaceOrigin,
    validPlaceDestination,
    validUser,
    validVisit
}