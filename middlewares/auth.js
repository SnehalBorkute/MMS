exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) return next();
    res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') return next();
    res.status(403).send('Access denied');
};

exports.isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') return next();
    res.status(403).send('Access denied');
};





// To protect admin routes
function isAdmin(req, res, next) {
    if (req.session.admin) {
        return next();
    }
    res.redirect("/auth/login");
}


// function isAdmin(req, res, next) {
//     if (req.session.admin) {
//         return next();
//     }

//     // Avoid redirect loop
//     if (req.path === '/auth/login') {
//         return next();
//     }

//     res.redirect("/auth/login");
// }


function isUser(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect("/auth/login");
}


module.exports = { isAdmin, isUser };
