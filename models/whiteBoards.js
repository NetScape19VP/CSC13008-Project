const mongoose = require('mongoose');

const whiteboardsSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	lastModified: Date,
	data: String
});

module.exports = mongoose.model('whiteboards', whiteboardsSchema);