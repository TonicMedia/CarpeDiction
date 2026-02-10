const jwt = require("jsonwebtoken");



// authenticates current User
module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.cookies.usertoken, process.env.JWT_KEY, { algorithms: ['HS256'] }, (err) => {
        if (err) {
            res.status(401).json({ verified: false });
        } else {
            next();
        }
    });
};
