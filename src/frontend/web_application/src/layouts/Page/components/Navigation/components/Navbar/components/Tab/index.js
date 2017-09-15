import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import Presenter from './presenter';

const tabsSelector = (state, props) => props.tab;
const routePathnameSelector = state => state.router.location && state.router.location.pathname;

const mapStateToProps = createSelector(
  [tabsSelector, routePathnameSelector],
  (tab, pathname) => {
    const isActive = pathname === tab.pathname;

    return { isActive };
  }
);

export default connect(mapStateToProps)(Presenter);
