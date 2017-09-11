import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { reduxForm } from 'redux-form';
import Presenter from './presenter';
import { requestSettings, updateSettings } from '../../../../store/modules/settings';

const settingsSelector = state => state.settings.settings;
const mapStateToProps = createSelector(
  [settingsSelector],
  settings => ({
    initialValues: settings,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestSettings,
  onSubmit: (values, disp, props) => updateSettings({
    settings: values, original: props.initialValues,
  }),
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator(),
  reduxForm({
    form: 'settings-presentation',
    enableReinitialize: true,
  })
)(Presenter);
