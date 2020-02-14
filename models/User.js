const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs');
const countries = require('i18n-iso-countries')
const phone = require('phone')

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
        },
        phone: {
            type: String,
            validate: (val) => {
                return phone(val,'',true).length > 0
            }
        },
        roles: [{
            type: String,
            enum: ['ranger','planner','admin']
        }]
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
    if (user.phone) {
        user.phone = phone(user.phone,'',true)[0]
    }
});

UserSchema.methods.pubProps = function() {
    return {
        _id: this.id,
        createdAt: this.createdAt,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        country: this.country,
        province: this.province,
        postalCode: this.postalCode,
        phone: this.phone,
        roles: this.roles,
        updatedAt: this.updatedAt
    }
}

UserSchema.methods.comparePassword = async function(candidate) {
    return bcrypt.compare(candidate,this.password);
}

module.exports = User = mongoose.model('user',UserSchema);
