import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslator } from '@gandi/react-translate';
import * as ApplicationManager from '../../../../services/application-manager';
import Presenter from './presenter';

const applicationListSelector = () => ApplicationManager.getApplications();
const applicationSelector = state =>
  ApplicationManager.getInfosFromName(state.application.applicationName);

const mapStateToProps = createSelector(
  [applicationSelector, applicationListSelector],
  (currentApplication, applications) => ({ currentApplication, applications })
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
