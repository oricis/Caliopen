import cookie from 'cookie';

export const isAuthenticated = () => {
  if (typeof document === 'object') {
    const { 'caliopen.web': token } = cookie.parse(document.cookie);

    return token && true;
  }

  throw new Error('isAuthenticated does not support server side execution');
};
