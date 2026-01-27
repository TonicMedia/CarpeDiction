const User = require("../models/user.model"),
    Comment = require("../models/comment.model"),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');



// creates a User
module.exports.register = (req, res) => {
    // verifies that no current User exists with submitted userName
    User.findOne({ userNameLower: req.body.userName.toLowerCase() })
        .then(user1 => {
            if (user1 == null) {
                // verifies that no current User exists with submitted email
                User.findOne({ emailLower: req.body.email.toLowerCase() })
                    .then(user2 => {
                        if (user2 == null) {
                            // verifies that submitted password and passwordConf match
                            if (req.body.password === req.body.passwordConf) {
                                User.create(req.body)
                                    .then(userNew => {
                                        res
                                            .cookie(
                                                "usertoken",
                                                jwt.sign({ _id: userNew._id }, process.env.JWT_KEY, { expiresIn: '1d' }),
                                                {
                                                    secure: process.env.NODE_ENV === 'production' ? true : false,
                                                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                                                    httpOnly: true,
                                                    maxAge: 24 * 60 * 60 * 1000,
                                                }
                                            )
                                            .json({
                                                msg: "User registration success!",
                                                user: {
                                                    _id: userNew._id,
                                                    userName: userNew.userName,
                                                    email: userNew.email,
                                                    favs: userNew.favs,
                                                }
                                            });
                                    })
                                    .catch(err => res.status(400).json(err));
                            } else {
                                res.cookie();
                                res.status(400).json({
                                    errors: {
                                        password: {
                                            message: "*Password and Password Confirmation must match!"
                                        }
                                    }
                                });
                            }
                        } else {
                            res.cookie();
                            res.status(400).json({
                                errors: {
                                    email: {
                                        message: "*An account with that email already exists!"
                                    }
                                }
                            });
                        }
                    })
                    .catch(err => res.status(400).json(err));
            } else {
                res.cookie();
                res.status(400).json({
                    errors: {
                        userName: {
                            message: "*An account with that username already exists!"
                        }
                    }
                });
            }
        })
        .catch(err => res.status(400).json(err));
};


// retrieves one User via the ID
module.exports.getUser = (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json({
            msg: "User retrieved successfully!",
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                favs: user.favs,
            }
        }))
        .catch(err => res.status(401).json(err));
};


// updates one User via their ID and new data
module.exports.updateUser = (req, res) => {
    // verifies that no other current User exists with submitted userName
    User.findOne({ userNameLower: req.body.userName.toLowerCase(), _id: { $ne: req.body._id } })
        .then(user1 => {
            if (user1 === null) {
                // verifies that no other current User exists with submitted email
                User.findOne({ emailLower: req.body.email.toLowerCase(), _id: { $ne: req.body._id } })
                    .then(user2 => {
                        if (user2 === null) {
                            // retrieves and updates the queried User after verifying uniqueness of submitted data
                            User.findById(req.body._id)
                                .then(userToUpdate => {
                                    if (req.body.userName.replace(/\s/g, '').length)
                                        userToUpdate.userName = req.body.userName;
                                    if (req.body.email.replace(/\s/g, '').length)
                                        userToUpdate.email = req.body.email;
                                    if (req.body.password && req.body.password.replace(/\s/g, '').length)
                                        userToUpdate.password = req.body.password;
                                    if (req.body.passwordConf && req.body.passwordConf.replace(/\s/g, '').length)
                                        userToUpdate.passwordConf = req.body.passwordConf;
                                    if (req.body.favs)
                                        userToUpdate.favs = req.body.favs;
                                    // saves the changes to the updated User
                                    userToUpdate.save()
                                        .then(updatedUser => {
                                            res.json({
                                                msg: "User updated successfully!",
                                                user: {
                                                    _id: updatedUser._id,
                                                    userName: updatedUser.userName,
                                                    email: updatedUser.email,
                                                    favs: updatedUser.favs,
                                                }
                                            })
                                        })
                                        .catch(err => res.status(400).json(err));
                                })
                                .catch(err => res.status(401).json(err));
                        } else {
                            res.cookie();
                            res.status(400).json({
                                errors: {
                                    email: {
                                        message: "*An account with that email already exists!"
                                    }
                                }
                            });
                        }
                    })
                    .catch(err => res.status(401).json(err));
            } else {
                res.cookie();
                res.status(400).json({
                    errors: {
                        userName: {
                            message: "*An account with that username already exists!"
                        }
                    }
                });
            }
        })
        .catch(err => res.status(401).json(err));
};


// deletes one User via their ID
module.exports.deleteUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            // wipes the association between the User and their comments
            Comment.find({ creator: `${user.userName} - ${user.email}` })
                .then(comments => {
                    comments.forEach(comment => {
                        comment.user = null;
                        comment.creator = comment.creator.concat(" - (DELETED)");
                        comment.save();
                    })
                    // deletes the User
                    User.deleteOne({ _id: req.params.id })
                        .then(deleteConfirmation => res.json(deleteConfirmation))
                        .catch(err => res.status(401).json(err));
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(401).json(err));
};


// logs a User out
module.exports.logout = (req, res) => {
    res.clearCookie('usertoken');
    res.sendStatus(200);
};


// logs authorizes a User login
module.exports.login = (req, res) => {
    // verifies that no current User exists with submitted email
    User.findOne({ emailLower: req.body.email.toLowerCase() })
        .then(user => {
            if (user == null) {
                res.cookie();
                res.status(401).json({
                    errors: {
                        email: {
                            message: "*Invalid email!"
                        }
                    }
                });
            } else {
                // verifies that submitted password matches the retrieved account
                bcrypt.compare(req.body.password, user.password)
                    .then(isValid => {
                        if (isValid === true) {
                            res
                                .cookie(
                                    "usertoken",
                                    jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: '1d' }),
                                    {
                                        secure: process.env.NODE_ENV === 'production' ? true : false,
                                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                                        httpOnly: true,
                                        maxAge: 24 * 60 * 60 * 1000,
                                    }
                                )
                                .json({
                                    msg: "User login success!",
                                    user: {
                                        _id: user._id,
                                        userName: user.userName,
                                        email: user.email,
                                        favs: user.favs,
                                    }
                                });
                        } else {
                            res.cookie();
                            res.status(401).json({
                                errors: {
                                    password: {
                                        message: "*Invalid password!"
                                    }
                                }
                            });
                        }
                    })
                    .catch(err => res.status(401).json(err));
            }
        })
        .catch(err => res.status(401).json(err));
};
