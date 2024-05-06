exports.isLoggedIn = function (req, res, next) {
    if(req.user) {
        next();
    } else {
       res.status(401).send('you must be logged in')
    }
}