import { withTranslator } from '@gandi/react-translate';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { getApplications } from '../../../../../../services/application-manager/';

const applicationSelector = state => state.application.applicationName;
const routePathnameSelector = state => state.router.location.pathname;

const mapStateToProps = createSelector(
  [applicationSelector, getApplications, routePathnameSelector],
  (currentApplicationName, applications, pathname) => {
    const currentApplication = applications
      .find(application => application.name === currentApplicationName);
    const isactive = pathname === currentApplication.route;

    return { currentApplication, applications, isactive };
  }
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
