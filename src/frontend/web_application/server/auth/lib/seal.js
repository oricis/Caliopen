import Iron from 'iron';

export function encode(obj, secret, callback) {
  Iron.seal(obj, secret, Iron.defaults, callback);
}

export function decode(seal, secret, callback) {
  Iron.unseal(seal, secret, Iron.defaults, callback);
}
