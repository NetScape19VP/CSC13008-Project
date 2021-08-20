const router = require('express').Router();
const breakRoom = require('../models/breakRooms');

const authCheck = require('../controllers/authCheck').authCheck;
const boardControllers = require('../controllers/board-controllers')

router.get('/', authCheck, boardControllers.mainPageController);

////! handle create board create route MUST be above
// router.get('/create', (req, res, next) => {
//     res.send('new board');
// })
router.get('/:roomID', authCheck, boardControllers.whiteboardController);

router.get('/:roomID', authCheck, (req, res) => {
    console.log("@" + req.user.name);
    
    // check roomID exist
    

    res.render('whiteboard', {
        user: req.user,
        room: req.params.roomID
    })
})

module.exports = router