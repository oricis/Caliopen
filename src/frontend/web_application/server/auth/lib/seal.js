'use strict';

var Iron = require('iron');

function encode(obj, secret, callback) {
  Iron.seal(obj, secret, Iron.defaults, callback);
}

function decode(seal, secret, callback) {
  Iron.unseal(seal, secret, Iron.defaults, callback);
}

module.exports = {
  encode: encode,
  decode: decode,
};
