import cookie from 'cookie';

export const isAuthenticated = () => {
  if (BUILD_TARGET === 'server') {
    return global.user && true;
  }

  if (BUILD_TARGET === 'browser') {
    const { 'caliopen.web': token } = cookie.parse(document.cookie);

    return token && true;
  }

  throw new Error('isAuthenticated does not support the current BUILD_TARGET');
};
