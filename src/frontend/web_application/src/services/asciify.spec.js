import { asciify } from './asciify';

describe('service asciify', () => {
  it('asciify', () => {
    expect(asciify('Ñareèm')).toEqual('Nareem');
    expect(asciify('Ñがarêèm ?!')).toEqual('Nareem ?!');
    expect(asciify('Ñがarêè-m ?!')).toEqual('Naree-m ?!');
    expect(asciify('ẹ́')).toEqual('e');
    // XXX: could be better to equal `-e`
    expect(asciify('がé')).toEqual('e');
  });
});
