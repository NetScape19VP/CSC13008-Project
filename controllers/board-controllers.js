//get /board
const mainPageController = (req, res) => {
    res.render('mainPage', { user: req.user })
}

//post /board/new
const createWhiteboard = (req, res) => {
    let roomName = req.body.roomName;
    
    //check if (room name already exist)
    //do many things below
    
    
    //just for check
    res.json({ 
        status: 201,
        roomID: 'room ID here',
        roomName: 'room name here',
    })

}

//get board/:boardID
const whiteboardController = (req, res) => {
    res.render('whiteboard', {
        user: req.user,
        room: req.params.roomID
    })
}

module.exports = {
    mainPageController,
    whiteboardController
}