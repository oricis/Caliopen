const { Router: createRouter } = require('express');
const createLoginRouting = require('./login');
const createSignupRouting = require('./signup');

const router = createRouter();
createLoginRouting(router);
createSignupRouting(router);

module.exports = router;
