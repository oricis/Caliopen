const checkCookie = require('./check-cookie');
const checkToken = require('./check-token');
const decodeCookie = require('./decode-cookie');
const catchLoginErrors = require('./catch-login-errors');

module.exports = { checkCookie, checkToken, decodeCookie, catchLoginErrors };
