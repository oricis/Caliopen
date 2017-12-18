import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import Presenter from './presenter';
import { filterTimeline } from '../../../../store/actions/timeline';
import { timelineFilterSelector } from '../../../../store/selectors/timeline';

const mapStateToProps = createSelector(
  [timelineFilterSelector],
  currentFilter => ({
    currentFilter,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  filter: filterTimeline,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
