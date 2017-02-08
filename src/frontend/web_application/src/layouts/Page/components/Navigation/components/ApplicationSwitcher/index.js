import { withTranslator } from '@gandi/react-translate';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { getApplications } from '../../../../../../services/application-manager/';

const applicationSelector = state => state.application.applicationName;

const mapStateToProps = createSelector(
  [applicationSelector, getApplications],
  (currentApplicationName, applications) => {
    const currentApplication = applications
      .find(application => application.name === currentApplicationName);

    return { currentApplication, applications };
  }
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
