const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs');
const countries = require('i18n-iso-countries')

const UserSchema = new Schema(
    {
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
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            enum: Object.keys(countries.getAlpha2Codes())
        },
        province: {
            type: String
        },
        postalCode: {
            type: String
        }
    },
    {
            timestamps: true
    }
);

UserSchema.plugin(uniqueValidator)
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
