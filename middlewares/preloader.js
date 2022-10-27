const { getById } = require('../services/adService');

function preload() {
    return async function (req, res, next) {
        res.locals.ad  = await getById(req.params.id);
        next();
    };
}

module.exports = preload;