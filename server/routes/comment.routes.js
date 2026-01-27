const CommentController = require('../controllers/comment.controller'),
    { authenticate } = require('../config/jwt.config');



// API routes to handle user CRUD
module.exports = function (app) {
    app.get('/api/comments/retrieve/:query', CommentController.retrieve);
    app.get('/api/comments/tops/:query', CommentController.getTops);
    app.post('/api/comments/post', authenticate, CommentController.post);
    app.put('/api/comments/like/', authenticate, CommentController.likeComment);
    app.delete('/api/comments/delete/:id', authenticate, CommentController.deleteComment);
};
