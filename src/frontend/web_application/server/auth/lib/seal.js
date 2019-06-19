import Iron from 'iron';

export function encode(obj, secret, callback) {
  Iron.seal(obj, secret, Iron.defaults, callback);
}

export function decode(sealed, secret, callback) {
  Iron.unseal(sealed, secret, Iron.defaults, callback);
}
