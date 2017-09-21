import { createSelector } from 'reselect';
import { connect } from 'react-redux';

const settingsSelector = state => state.settings.settings;
const mapStateToProps = createSelector(
  [settingsSelector],
  settings => ({
    settings,
  })
);

const withSettings = () => Component => connect(mapStateToProps)(Component);

export default withSettings;
