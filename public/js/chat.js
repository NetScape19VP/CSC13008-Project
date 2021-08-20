const chatMessages = document.querySelector('.chat-messages');

//var socket = io('http://localhost:3000/');
console.log(userLocal, roomLocal);
// ! join room
socket.emit('joinRoom', { user: userLocal, room: roomLocal});

// get room and users
socket.on('roomUsers', ({ room, users }) => {
	console.log('?Room:', room);
	console.log('?Users:', users);

	printRoomName(room);
	printUsers(users);
});

// message from server
socket.on('message', message => {
	console.log('?msg:', message);
	printMessage(message);

	// scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
document.getElementById('chat-form').addEventListener('submit', (event) => {
	event.preventDefault();

	//get message text
	const msg = event.target.elements.msg.value;

	// emit message from server
	socket.emit('chatMessage', msg);

	// clear input form
	event.target.elements.msg.value = '';
	event.target.elements.msg.focus();
});

// output message to DOM
function printMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.user.name} <span>${message.time}</span></p>
					 <p class="text">${message.text}</p>`;
	chatMessages.appendChild(div);
}

socket.on('Server-notify', (data) => {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${data.bot} <span>${data.time}</span></p>
					 <p class="text">${data.notification}</p>`;
	chatMessages.appendChild(div);
})

// add room name to DOM
function printRoomName(room) {
	document.getElementById("room-name").innerText = room;
}

// add users to DOM
function printUsers(users) {
	document.getElementById('users').innerHTML = `${users.map(user => `<li>${user.user.name}</li>`).join('')}`;
}