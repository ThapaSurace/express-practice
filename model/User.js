const mongoose = require("mongoose")
const User = mongoose.Schema

const userSchema = new User({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)