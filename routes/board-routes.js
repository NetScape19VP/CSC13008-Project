const router = require('express').Router();

const authCheck = require('../controllers/authCheck').authCheck;
const boardControllers = require('../controllers/board-controllers')

router.get('/', authCheck, boardControllers.mainPageController);

////! handle create board create route MUST be above
// router.get('/create', (req, res, next) => {
//     res.send('new board');
// })
router.get('/:roomID', authCheck, boardControllers.whiteboardController);

module.exports = router