import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { refreshApp } from '../store/modules/application';

const pathnameSelector = state => state.router.location && state.router.location.pathname;

const mapStateToProps = createSelector(
  [pathnameSelector],
  pathname => ({
    pathname,
  })
);

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClickApp: (app) => {
    if (ownProps.pathname === app.route) {
      dispatch(refreshApp(app.name));
    }
  },
});

export const withRefreshApp = () => compose(
  connect(mapStateToProps),
  connect(null, mapDispatchToProps),
);
