const {
    chai,
    factory,
    mongoose,
    server,
    should
} = require('./support/setup')

const User = require('../models/User');

after(async () => {
    server.shutdown();
    mongoose.disconnect();
});
afterEach(async () => {
    // Need to specifically delete users because they may not have been created by factories
    await User.deleteMany({})
    return factory.cleanUp()
})

module.exports = {
	chai,
	factory,
	server,
    mongoose,
    should
};