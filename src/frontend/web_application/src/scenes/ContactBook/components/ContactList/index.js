import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import Presenter from './presenter';

const settingsSelector = state => state.settings.settings;
const mapStateToProps = createSelector(
  [settingsSelector],
  ({ contact_display_order, contact_display_format }) => ({
    contact_display_order,
    contact_display_format,
  })
);

export default connect(mapStateToProps)(Presenter);
