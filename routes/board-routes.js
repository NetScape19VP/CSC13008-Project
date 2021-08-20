const router = require('express').Router();
const breakRoom = require('../models/breakRooms');

//check if user has logged in
const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.render('mainPage', { user: req.user })
});

router.get('/:roomID', authCheck, (req, res) => {
    console.log("@" + req.user.name);
    
    // check roomID exist
    

    res.render('whiteboard', {
        user: req.user,
        room: req.params.roomID
    })
})

module.exports = router