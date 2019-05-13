import { isValidRecipient } from './isValidRecipient';

describe('draftMessage module - services - isValidRecipient', () => {
  it('recipient is not same type as identity', async () => {
    const identity = { protocol: 'email' };
    const recipient = { protocol: 'twitter', address: 'foo' };

    expect(isValidRecipient({ recipient, identity })).toEqual(false);
  });

  it('recipient is same type as identity', async () => {
    const identity = { protocol: 'email' };
    const recipient = { protocol: 'email', address: 'foo@bar.tld' };

    expect(isValidRecipient({ recipient, identity })).toEqual(true);
  });

  it('recipient is same type as identity but address does not match config', async () => {
    const identity = { protocol: 'email' };
    const recipient = { protocol: 'email', address: 'bar_tld' };

    expect(isValidRecipient({ recipient, identity })).toEqual(false);
  });
});
