const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: () => { Date.now }
    }
});

UserSchema.pre('save',async function() {
    var user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
    }
});

UserSchema.methods.comparePassword = async function(candidate) {
    return bcrypt.compare(candidate,this.password);
}

module.exports = User = mongoose.model('user',UserSchema);
