const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    accountType: String,
    userId: String,
    name: String,
    avtURL: String,
    recentBoard: [{
        type: mongoose.Schema.ObjectId
    }]
})

module.exports = mongoose.model('users', usersSchema)