const room = require('../models/breakRooms');

const createRoom = (req, res) => {
	if (req.body.name == '') {
		//res.send('Cannot create room without name');
		console.log('Cannot create room without name');
		return;
	}

	new breakRoom({
		name: req.body.name
	}).save().then((newRoom) => {
		console.log('Create room with name: ' + newRoom.name);
		//res.send('Create room with name: ' + newRoom.name);
	});
}

const isExistRoom = async (req, res) => {
	await function checkRoom(roomID) {
		room.findOne({ _id: roomID }).then((room) => {
			if (room) {
				console.log('Found room with ID: ' + roomID);
				return true;
			}
			console.log('Cannot find room with ID: ' + roomID);
			return false;
		});
	}

	const check = checkRoom(req.params.roomID);
	return check;
}

const deleteRoom = (req, res) => {
	room.findOneAndRemove({
		_id: req.params.roomID
	}).then((room) => {
		if (room === null) {
			console.log('Can not delete room with ID: ' + req.params.roomID);
		} else {
			console.log('Delete successful room with ID: ' + req.params.roomID);
		}
	})
}

module.exports = {
	createRoom,
	isExistRoom,
	deleteRoom
}