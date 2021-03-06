const router = require('express').Router();
const passport = require('passport')


//GOOGLE AUTHENTICATE
router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
    // ,
    // prompt: "select_account" // for choosing account every login session
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/callback', passport.authenticate(
    'google',
    {
        failureRedirect: '/'
    }),
    (req, res) => {
        res.redirect(`/board`)
    }
);

//FACEBOOK AUTHENTICATE
router.get('/facebook', passport.authenticate('facebook'));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }), (req, res) => {
    res.redirect(`/board`)
});

//log out
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})
module.exports = router