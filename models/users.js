const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    accountType: String,
    userId: String,
    name: String,
    avtURL: String,
    boards: [{
        type: mongoose.Schema.ObjectId
    }]
})

module.exports = mongoose.model('users', usersSchema)