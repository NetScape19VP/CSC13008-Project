const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    accountType: String,
    userId: String,
    name: String,
    avtURL: String,
<<<<<<< HEAD
    boards: [{type:String}]
=======
    recentBoard: [{
        type: mongoose.Schema.ObjectId
    }]
>>>>>>> 400665df679b1ee0475e1ddb50d4a9698c960efa
})

module.exports = mongoose.model('users', usersSchema)