const router = require('express').Router();

const authCheck = require('../controllers/authCheck').authCheck;
const { mainPageController, 
    whiteboardController, 
    createWhiteboard, 
    isExistWhiteboard, 
    deleteWhiteboard  } = require('../controllers/board-controllers')

router.get('/', authCheck, mainPageController);

//! handle create board create route MUST be above
router.post('/join', authCheck, isExistWhiteboard);

router.post('/create', authCheck, createWhiteboard);

router.get('/:whiteboardCode', authCheck, whiteboardController);

module.exports = router