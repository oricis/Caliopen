const { Router: createRouter } = require('express');
const createSigninRouting = require('./signin');
const createSignupRouting = require('./signup');

const router = createRouter();
createSigninRouting(router);
createSignupRouting(router);

module.exports = router;
