const chatMessages = document.querySelector('.chat-messages');

//var socket = io('http://localhost:3000/');
console.log(userLocal, whiteboardLocalCode);
// ! join room
socket.emit('joinRoom', { user: userLocal, room: whiteboardLocalCode });

// // get room and users
// socket.on('roomUsers', ({ room, users }) => {
// 	console.log('?Room:', room);
// 	console.log('?Users:', users);

// 	printRoomName(room);
// 	printUsers(users);
// });

//insert message to box chat
var chatlog = document.getElementById("chatlog");

function newReceive(str, user, isBot = false) { //recive mess and bring to box chat
	if (str == "")
		return;

	var mess = document.createElement("div");
	mess.classList.add("recived");

	if (!isBot) {
		//make a received div

		mess.innerHTML = /*html*/
			`<div class="recived">
					<div class="from">
						<img src=${user.avtURL} alt="user">
					</div>
				<div class="mess R">${str}</div>
			</div>`
	}
	else {
		mess.innerHTML = /*html*/
		`<div class="recived">
				<div class="from">
					<img src='/images/bot.png' alt="bot">
				</div>
			<div class="mess R">${str}</div>
		</div>`

	}
	chatlog.appendChild(mess);

	//scroll to bottom
	chatlog.scrollTo({ top: chatlog.scrollHeight, behavior: "smooth" });
}

function newSend(str) { // 
	if (str == "")
		return;
	//make a send div
	var mess = document.createElement("div");
	mess.classList.add("send");
	mess.innerHTML = /*html */
		`<div class="mess S">${str}</div>
		<div class="from">
			<img src=${userLocal.avtURL} alt="">
		</div>`
	chatlog.appendChild(mess);

	//scroll to bottom
	chatlog.scrollTo({ top: chatlog.scrollHeight, behavior: "smooth" });
	//do something with server here (send this mess to another)
}

//event to get message from input text by send button
var sendbox = document.getElementById("sendbox");
var sendbtn = document.getElementById("send-btn");
sendbtn.addEventListener('click', () => {
	var message = sendbox.value;
	sendbox.value = ''
	socket.emit('chatMessage', message);
})


socket.on('message', data => {
	console.log('data', data.user._id);
	console.log('userLocal', userLocal._id);
	if (data.user._id != userLocal._id) {
		newReceive(data.text, data.user)
	}
	else {
		newSend(data.text);
	}
});

// // message from server
// socket.on('message', message => {
// 	console.log('?msg:', message);
// 	printMessage(message);

// 	// scroll down
// 	chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// // message submit
// document.getElementById('chat-form').addEventListener('submit', (event) => {
// 	event.preventDefault();

// 	//get message text
// 	const msg = event.target.elements.msg.value;

// 	// emit message from server
// 	socket.emit('chatMessage', msg);

// 	// clear input form
// 	event.target.elements.msg.value = '';
// 	event.target.elements.msg.focus();
// });

// // output message to DOM
// function printMessage(message) {
// 	const div = document.createElement('div');
// 	div.classList.add('message');
// 	div.innerHTML = `<p class="meta">${message.user.name} <span>${message.time}</span></p>
// 					 <p class="text">${message.text}</p>`;
// 	chatMessages.appendChild(div);
// }

socket.on('Server-notify', (data) => {
	newReceive(data.notification, data.bot, true)
	// const div = document.createElement('div');
	// div.classList.add('message');
	// div.innerHTML = `<p class="meta">${data.bot} <span>${data.time}</span></p>
	// 				 <p class="text">${data.notification}</p>`;
	// chatMessages.appendChild(div);
})

// // add room name to DOM
// function printRoomName(room) {
// 	document.getElementById("room-name").innerText = room;
// }

// // add users to DOM
// function printUsers(users) {
// 	document.getElementById('users').innerHTML = `${users.map(user => `<li>${user.user.name}</li>`).join('')}`;
// }