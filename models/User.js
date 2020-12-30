const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const countries = require('i18n-iso-countries')
const phone = require('phone')
const { useHandleMongoError11000 } = require('./middleware/errorMiddleware')
const crypto = require('crypto')
const config = require('config')
const jwtSecret = config.jwtSecret
const jwt = require('jsonwebtoken')
const roles = require('./enums/roles')

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
            required: true
        },
        enableGeolocation: {
            type: Boolean,
            default: true
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
        memberships: [{
            organization: {
                type: Schema.Types.ObjectId,
                ref: 'organization',
                required: true
            },
            roles: [{
                type: String,
                enum: roles
            }]
        }],
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
        distanceUnitOfMeasure: {
            type: String,
            required: true,
            default: 'mi',
            enum: ['km','mi']
        },
        roles: [{
            type: String,
            enum: roles
        }],
        resetPasswordTokens: [{
            token: {
                type: String,
                required: true
            },
            expires: {
                type: Date,
                required: true
            },
            expended: {
                type: Date
            }
        }]
    },
    {
            timestamps: true
    }
);

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

UserSchema.post('save',async function (user) {
    await user.populate('memberships.organization').execPopulate()
})

/* Issues a JSON web token in a server response for a user who has been authenticated
 */
UserSchema.methods.genToken = async function() {
    const user = this
    return jwt.sign(
        { id: user.id },
        jwtSecret,
        { expiresIn: 2678400 }
    )
}

UserSchema.methods.createResetPasswordToken = async function() {
    var user = this
    const newToken = {
        token: await new Promise((resolve,reject) => {
            crypto.randomBytes(20,(err,buf) => {
                if (err) { reject('error generating token') }
                resolve(buf.toString('hex'))
            })
        }),
        expires: Date.now() + 3600000 // 1 hour
    }
    user.resetPasswordTokens.push(newToken)
    await user.save()
    return newToken
}

UserSchema.methods.resetPasswordWithToken = async function (token,password) {
    const user = this
    const tokenRecord = user.resetPasswordTokens.find((t) => t.token === token)
    tokenRecord.expended = Date.now()
    user.password = password
    user.save()
}

UserSchema.methods.pubProps = function() {
    return {
        _id: this.id,
        createdAt: this.createdAt,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        enableGeolocation: this.enableGeolocation,
        country: this.country,
        memberships: this.memberships,
        province: this.province,
        postalCode: this.postalCode,
        phone: this.phone,
        distanceUnitOfMeasure: this.distanceUnitOfMeasure,
        roles: this.roles,
        updatedAt: this.updatedAt
    }
}

UserSchema.methods.comparePassword = async function(candidate) {
    return bcrypt.compare(candidate,this.password);
}

useHandleMongoError11000(UserSchema)

module.exports = User = mongoose.model('user',UserSchema);
