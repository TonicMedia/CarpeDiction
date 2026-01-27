const UserController = require('../controllers/user.controller'),
    { authenticate } = require('../config/jwt.config');



// API routes to handle user CRUD
module.exports = function (app) {
    app.post('/api/register', UserController.register);
    app.post('/api/login', UserController.login);
    app.get('/api/logout', authenticate, UserController.logout);
    app.get('/api/users/:id', authenticate, UserController.getUser);
    app.put('/api/users', authenticate, UserController.updateUser);
    app.delete('/api/users/:id', authenticate, UserController.deleteUser);
};
