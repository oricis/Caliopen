import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { requestTabs, removeTab } from '../../../../../../store/modules/tab';

const tabsSelector = state => state.tab.tabs;

const mapStateToProps = createSelector(
  [tabsSelector],
  tabs => ({
    // XXX; remove filter once we use real tabs for home & contact
    tabs: tabs.filter(tab => (tab.pathname !== '/' && tab.pathname !== '/contacts')),
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestTabs,
  removeTab,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
