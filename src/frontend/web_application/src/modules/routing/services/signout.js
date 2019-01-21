import getRouterHistory from '../../../services/router-history';

export const signout = ({ withRedirect } = { withRedirect: false }) => {
  if (BUILD_TARGET !== 'browser') {
    throw new Error('`signout` must be used in a browser');
  }

  const history = getRouterHistory();
  const { pathname, search, hash } = history.location;
  const redirect = withRedirect ? `?redirect=${pathname}${hash}${search}` : '';

  // force full reload in order to clear stores
  window.location.href = `/auth/signout${redirect}`;
};
