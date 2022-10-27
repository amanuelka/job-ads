const { parseError } = require('../middlewares/parsers');
const { isGuest, hasUser } = require('../middlewares/guards');
const { register, login } = require('../services/userService');

const authController = require('express').Router();

authController.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

authController.post('/register', isGuest(), async (req, res) => {
    try {
        if (Object.values(req.body).some(v => !v)) {
            throw new Error('All fields are required');
        }
        if (req.body.password.length < 5) {
            throw new Error('Password must be at least 5 characters long');
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }
        const token = await register(req.body.email, req.body.description, req.body.password);

        res.cookie('token', token);
        res.redirect('/');
    }
    catch (error) {
        const errors = parseError(error);
        res.render('register', {
            errors,
            body: {
                email: req.body.email,
                description: req.body.description
            }
        });
    }
});

authController.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

authController.post('/login', isGuest(), async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }
    catch (error) {
        const errors = parseError(error);
        res.render('login', { errors, body: { email: req.body.email } });
    }
});

authController.get('/logout', hasUser(), (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;