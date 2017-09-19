import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { getFormValues } from 'redux-form';
import Presenter from './presenter';

const settingsSelector = state => state.settings.settings;
const formValuesSelector = (state, ownProps) => getFormValues(ownProps.form)(state);

const mapStateToProps = createSelector(
  [settingsSelector, formValuesSelector],
  ({ contact_display_format }, formValues) => ({
    contact_display_format,
    contact: formValues,
  })
);

export default compose(
  connect(mapStateToProps),
  withTranslator()
)(Presenter);
