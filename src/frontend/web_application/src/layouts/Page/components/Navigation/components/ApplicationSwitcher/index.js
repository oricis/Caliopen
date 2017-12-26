import { withI18n } from 'lingui-react';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { getApplications } from '../../../../../../services/application-manager/';
import { withRefreshApp } from '../../../../../../hoc/application';

const applicationSelector = state => state.application.applicationName;
const locationSelector = state => state.router.location;

const mapStateToProps = createSelector(
  [applicationSelector, getApplications, locationSelector],
  (currentApplicationName, applications, location) => {
    const currentApplication = applications
      .find(application => application.name === currentApplicationName);
    const isactive = location && location.pathname === currentApplication.route;

    return { currentApplication, applications, isactive };
  }
);

export default compose(
  connect(mapStateToProps),
  withRefreshApp(),
  withI18n()
)(Presenter);
