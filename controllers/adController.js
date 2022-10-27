const { isOwner } = require('../middlewares/guards');
const { parseError } = require('../middlewares/parsers');
const preload = require('../middlewares/preloader');
const { create, deleteByid, update, getByIdPopulated, apply } = require('../services/adService');

const adController = require('express').Router();

adController.get('/create', (req, res) => {
    res.render('create');
});

adController.post('/create', async (req, res) => {
    const data = { ...req.body, owner: req.user._id };

    try {
        if (Object.values(data).some(v => !v)) {
            throw new Error('All fields are required');
        }
        await create(data);
        res.redirect('/catalog');
    } catch (err) {
        res.render('create', { errors: parseError(err), ...data });
    }

});

adController.get('/:id', async (req, res) => {
    const ad = await getByIdPopulated(req.params.id);

    ad.isOwner = req.user && ad.owner._id == req.user._id;
    ad.hasApplied = req.user && ad.users.some(u => u._id == req.user._id);

    res.render('details', { ...ad });
});

adController.get('/:id/delete', preload(), isOwner(), async (req, res) => {
    await deleteByid(req.params.id);
    res.redirect('/catalog');
});

adController.get('/:id/edit', preload(), isOwner(), async (req, res) => {
    const ad = res.locals.ad;
    res.render('edit', { ...ad });
});

adController.post('/:id/edit', preload(), isOwner(), async (req, res) => {
    try {
        await update(req.params.id, { ...req.body, _id: req.params.id });
        res.redirect(`/ad/${req.params.id}`);
    } catch (error) {
        res.render('edit', { errors: parseError(error), ...req.body });
    }
});

adController.get('/:id/apply', preload(), async (req, res) => {
    const ad = res.locals.ad;
    if (ad.owner != req.user._id && ad.users.some(u => u._id == req.user._id) == false) {
        await apply(req.params.id, req.user._id);
    }
    res.redirect(`/ad/${req.params.id}`);
});

module.exports = adController;