export const signout = () => {
  if (typeof window === 'undefined') {
    throw new Error('`signout` must be used in a browser');
  }

  window.location.href = '/auth/signout';
};
