import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withI18n } from 'lingui-react';
import * as ApplicationManager from '../../../../services/application-manager';
import { withRefreshApp } from '../../../../hoc/application';
import Presenter from './presenter';

const applicationListSelector = () => ApplicationManager.getApplications();
const applicationSelector = state =>
  ApplicationManager.getInfosFromName(state.application.applicationName);

const mapStateToProps = createSelector(
  [applicationSelector, applicationListSelector],
  (currentApplication, applications) => ({
    currentApplication, applications,
  })
);

export default compose(
  withI18n(),
  connect(mapStateToProps),
  withRefreshApp(),
)(Presenter);
