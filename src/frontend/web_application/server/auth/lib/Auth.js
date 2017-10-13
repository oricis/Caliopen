const API = require('../../api/lib/api');

const API_PATH_AUTH = '/api/v1/authentications';
const API_PATH_SIGNUP = '/api/v1/users';

// username, password, callback
function signup(params) {
  return this.query(
    Object.assign({
      path: API_PATH_SIGNUP,
    }, params)
  );
}

function authenticate(params) {
  if (!params || !(params.username && params.password)) {
    throw new Error(
      'Bad parameters: authenticate({' +
        'username, password, [response], [success], [error]' +
      '})'
    );
  }

  params.body = {
    username: params.username + '',
    password: params.password + '',
  };

  delete params.username;
  delete params.password;

  return this.query(
    Object.assign({
      path: API_PATH_AUTH,
    }, params)
  );
}

// refreshToken, uuid, callback
function refreshAccessToken() {
  // XXX: usefull ?
  // what should be API_PATH_TOKENS ?

  // return this.query(
  //   Object.assign({
  //     path: API_PATH_TOKENS,
  //   }, params)
  // );
}

class Auth {
  defaults = {
    /* These defaults souldn't need be overidden */
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',

    /* But you might want to override these */
    response: /* defaultResponseCallback(response) */
      function defaultResponseCallback() {},
    success: /* defaultSuccessCallback(user) */
      function defaultSuccessCallback() {},
    error: /* defaultErrorCallback(error) */
     function defaultErrorCallback() {},
  }
}

Auth.prototype.query = API.query;
Auth.prototype.signup = signup;
Auth.prototype.authenticate = authenticate;
Auth.prototype.refreshAccessToken = refreshAccessToken;

module.exports = Auth;
