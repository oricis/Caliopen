import { ec as EC } from 'elliptic';

export const CURVE_TYPE = 'p256';
export const CURVE_TYPE_ASSOC = {
  p256: 'P-256',
};

let ec;
const getEC = () => {
  if (!ec) {
    ec = new EC(CURVE_TYPE);
  }

  return ec;
};

export const generate = () => getEC().genKeyPair();
export const getKeypair = priv => getEC().keyFromPrivate(priv, 'hex');
export const sign = (keypair, hash) => keypair.sign(hash);
