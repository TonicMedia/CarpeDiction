const WotdController = require('../controllers/wotd.controller');



// API routes for WOTD
module.exports = function (app) {
    app.post('/api/wotd/add', WotdController.add);
    app.get('/api/wotd/latest', WotdController.latest);
    app.get('/api/wotd/archive', WotdController.archive);
};
