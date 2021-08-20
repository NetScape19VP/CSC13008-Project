//check if user has logged in
const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = {
    authCheck: authCheck
}