const users = [];

// join user to chat
function userJoin(socketID, user, room) {
	const userInfo = { id: socketID, user: user, room: room };
	users.push(userInfo);
	return userInfo;
}

// get current user
function getCurrentUser(id) {
	return users.find(user => user.id === id);
}

// user leave room
function userLeave(id) {
	const index = users.findIndex(user => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

// get room users
function getRoomUsers(room) {
	return users.filter(user => user.room === room);
}

module.exports = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers
}