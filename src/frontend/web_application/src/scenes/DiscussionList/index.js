import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { requestDiscussions, loadMoreDiscussions, hasMore } from '../../store/modules/discussion';
import Presenter from './presenter';

const discussionSelector = state => state.discussion;
const mapStateToProps = createSelector(
  [discussionSelector],
  state => ({
    discussions: state.discussions.map(discussionId => state.discussionsById[discussionId]),
    isFetching: state.isFetching,
    hasMore: hasMore(state),
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestDiscussions,
  loadMoreDiscussions,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
