const { Router: createRouter } = require('express');
const createLoginRouting = require('./login');

const router = createRouter();
createLoginRouting(router);

module.exports = router;
