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

const checkRoomExist = (req, res) => {
	const check = await checkRoom(req.params.roomID);
	
	async function checkRoom(roomID) {
		room.findOne({ _id: roomID }).then((room) => {
			if (room) {
				console.log('Found room with ID: ' + req.params.roomID);
				return true;
			}
			console.log('Cannot find room with ID: ' + req.params.roomID);
			return false;
		});
	}

	return check;
}

module.exports = {
	createRoom,
	checkRoomExist
}