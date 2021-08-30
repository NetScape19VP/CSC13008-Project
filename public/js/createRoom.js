document.getElementById('btn-create').onclick = async () => {
	// send req to server
	let roomName = document.getElementById('room-name').value;

	const rawRes = await fetch('http://localhost:3000/board/create', {
		method: "GET",
		body: {
			roomName: roomName
		}
	});

	const data = await rawRes.json();

	if (data.status === 'success') {
		// redirect to roomID
		window.location(data.redirectURL);
	}
	else {
		alert('fail to create room');
	}
}