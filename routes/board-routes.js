const router = require('express').Router();
const breakRoom = require('../models/breakRooms');

const authCheck = require('../controllers/authCheck').authCheck;
const boardControllers = require('../controllers/board-controllers')
const { createRoom, isExistRoom, deleteRoom } = require('./handleRooms');
router.get('/', authCheck, boardControllers.mainPageController);


//! handle create board create route MUST be above
router.get('/join', (req, res, next) => {
    breakRoom.findOne({_id: req.body.id}).then(room => {
        if (room) {
            res.json(JSON.stringify({
                status: "success",
                redirectURL: "url",
                room:room
            }))
        }
        else {
            res.json(JSON.stringify({
                status: "failed",
                redirectURL: "url",
                room:room
            }))
        }
    });
});

router.get('/create', authCheck, createRoom);

router.get('/:roomID', authCheck, boardControllers.whiteboardController);

router.get('/:roomID', authCheck, (req, res) => {
    console.log("@user - room: " + req.user.name + ' - ' + req.params.roomID);

    // check roomID exist
    if (isExistRoom(req, res)) {
        console.log('room exist');
        //redirect successful
        res.render('whiteboard', {
            user: req.user,
            room: req.params.roomID
        });
    } else {
        console.log('room not exist');
        //redirect to main page
        alert('roomID is not valid.');
    }
})

module.exports = router