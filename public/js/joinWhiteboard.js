async function joinWhiteboard(WBCode) {

	//send req to server

	const rawRes = await fetch('http://localhost:3000/board/join',
		//data    
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify({
				whiteboardCode: WBCode
			})
		}
	);

	const data = JSON.parse(await rawRes.json());
	//  status: "success",
	//  redirectURL: "url",
	//  room:room

	return data;
}