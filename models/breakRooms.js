const mongoose = require('mongoose');

const breakRoomsSchema = new mongoose.Schema({
	name: String,
	roomId: String,
	content: {}
});

module.exports = mongoose.model('breakRooms', breakRoomsSchema);