const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        unique: true,
        default: 'NA'
    }
});

module.exports = model('User', userSchema);