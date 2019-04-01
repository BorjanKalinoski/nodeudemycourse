const Schema=require('mongoose').Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwb = require('jsonwebtoken');
const Task = require('../task-model');
const userSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain password');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true,

});

userSchema.virtual('tasks', {
    ref:'Task',
    localField: '_id',
    foreignField: 'owner'
});
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.model('User').findOne({email: email});
    console.log('user pass ' + user.password + ' '+password);
    if (!user) {
        throw new Error('Unable to login!');
    }
    if (!(await bcrypt.compare(password, user.password))) {
        throw new Error('Unable to login!');
    }
    return user;
};
userSchema.methods.generateAuthToken = async function () {
    return jwb.sign({_id: this._id.toString()}, 'thisismysecret');
};
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.pre('remove', async function (next) {
    await Task.deleteMany({owner: this._id});
    next();
});
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

module.exports = userSchema;