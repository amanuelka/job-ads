const { getAll, getOwn } = require('../services/adService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const articles = await getAll();
    res.render('home', { articles });
});

homeController.get('/catalog', async (req, res) => {
    const articles = await getAll();
    res.render('catalog', { articles });
});

homeController.get('/search', async (req, res) => {
    const articles = await getOwn(req.query.search);
    res.render('search', { articles, search: req.query.search });
});


module.exports = homeController;