const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const adController = require('../controllers/adController');

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/ad', adController);
    app.get('*', (req, res) => { res.render('404'); });
};