import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { requestDiscussions, loadMoreDiscussions, hasMore } from '../../store/modules/discussion';
import Presenter from './presenter';

const discussionSelector = state => state.discussion;
const userSelector = state => state.user.user;
const mapStateToProps = createSelector(
  [discussionSelector, userSelector],
  (discussionState, user) => ({
    user,
    discussions: discussionState.discussions.map(
      discussionId => discussionState.discussionsById[discussionId]
    ),
    isFetching: discussionState.isFetching,
    hasMore: hasMore(discussionState),
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
