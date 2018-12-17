import { isValidRecipient } from './isValidRecipient';

describe('draftMessage module - services - isValidRecipient', () => {
  it('recipient is not same type as identity', async () => {
    const identity = { protocol: 'email' };
    const recipient = { protocol: 'twitter' };

    expect(isValidRecipient({ recipient, identity })).toEqual(false);
  });

  it('recipient is same type as identity', async () => {
    const identity = { protocol: 'email' };
    const recipient = { protocol: 'email' };

    expect(isValidRecipient({ recipient, identity })).toEqual(true);
  });
});
