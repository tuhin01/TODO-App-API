const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
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
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.indexOf('password') !== -1) {
                throw new Error("'password' can not be in the password!!");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!');
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
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {

    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;

}

userSchema.methods.getAuthenticatedToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisismysecretkey');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to login');
    }

    const isAuthenticate = await bcrypt.compare(password, user.password);
    if (!isAuthenticate) {
        throw new Error('Unable to login');
    }

    return user;

};

// Hash the password before saving/editing the user
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Remove all tasks when a user is deleted
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id})

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
