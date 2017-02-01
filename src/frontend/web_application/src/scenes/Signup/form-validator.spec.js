import validator from './form-validator';

describe('scene Signup form-validator', () => {
  const noopStr = str => str;
  it('validates', async () => {
    const isValid = await validator.validate({
      username: 'bender',
      password: '101121',
      tos: true,
      recovery_email: 'bender@planetexpress.tld',
    }, noopStr, 'full');
    expect(isValid).toBe(true);
  });
  it('render errors for form', async () => {
    try {
      const isValid = await validator.validate({
        password: '',
        tos: false,
        recovery_email: 'bender',
      }, noopStr, 'full');
      expect(isValid).not.toBe(true);
    } catch (e) {
      expect(e).toEqual({
        username: ['signup.feedback.required_username'],
        tos: ['signup.feedback.required_tos'],
        password: ['signup.feedback.required_password'],
        recovery_email: ['signup.feedback.invalid_recovery_email'],
      });
    }
  });
});
