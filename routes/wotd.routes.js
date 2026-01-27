const WotdController = require('../controllers/wotd.controller');



// API routes to handle user CRUD
module.exports = function (app) {
    app.post('/api/wotd/add', WotdController.add);
    app.get('/api/wotd/latest', WotdController.latest);
    app.get('/api/wotd/archive', WotdController.archive);
};
