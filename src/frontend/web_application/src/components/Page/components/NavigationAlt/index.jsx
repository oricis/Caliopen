import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslator } from '@gandi/react-translate';
import * as ApplicationManager from '../../../../services/application-manager';
import Presenter from './presenter';

const userSelector = state => state.user.user;
const applicationListSelector = () => ApplicationManager.getApplications();
const applicationSelector = state =>
  ApplicationManager.getInfosFromName(state.application.applicationName);

const mapStateToProps = createSelector(
  [userSelector, applicationSelector, applicationListSelector],
  (user, currentApplication, applications) => ({ user, currentApplication, applications })
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
