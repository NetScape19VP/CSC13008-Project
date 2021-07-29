const router = require('express').Router();

//check if user has logged in
const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    console.log(req.user.name);
    res.render('whiteboard', {user: req.user})
});

router.get('/:name', authCheck, (req, res) => { 
    console.log(req.user.name);
    res.render('whiteboard', {user: req.user})
})
module.exports = router