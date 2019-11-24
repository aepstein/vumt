const {
    User,
    Visit
} = require('../../models');
const {
    validUser,
    validVisit
} = require('../../test/support/factories');

const UserFactory = async (attrs={}) => {
    return new User({
        ...validUser(),
        attrs
    }).save();
};

const VisitFactory = async (attrs={}) => {
    let { userId } = attrs;
    if (!userId) {
        const user = await UserFactory();
        userId = user.id;
    }
    const newVisit = new Visit({
        ...validVisit(attrs),
        userId
    });
    return newVisit.save();
}

module.exports = {
    UserFactory,
    VisitFactory
};