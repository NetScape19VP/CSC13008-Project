async function createWhiteBoard (whiteboardName) {
	// send req to server
	const rawRes = await fetch(`${MY_URL}board/create`, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({whiteboardName: whiteboardName})
	});
	// // console.log(rawRes);
	// // console.log(typeof rawRes);

	
	const data = JSON.parse(await rawRes.json());

	return data;
	// // //console.log(typeof data);
	// // if (data.status == 'success') {
	// // 	// redirect to roomID
	// // 	window.location.href = `/board/${data.roomID}`;
	// // }
	// // else {
	// // 	alert('fail to create room');
	// // }
}