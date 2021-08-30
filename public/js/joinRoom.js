document.getElementById("btn-join").onclick = async () => {

	//send req to server
	let roomID = document.getElementById("room-id").value;

	const rawRes = await fetch('http://localhost:3000/board/join',
		//data    
		{
			method: "GET",
			body: {
				roomID: roomID
			}
		}
	);

	const data = await rawRes.json(); 
	//  status: "success",
	//  redirectURL: "url",
	//  room:room


	if (data.status === 'success'){
		//redirect to room when
		window.location(data.redirectURL);
	}
	else {
		function showBadRequestNotification() {
			alert('failed');
		}
	}
}