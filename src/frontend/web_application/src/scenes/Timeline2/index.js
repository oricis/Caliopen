import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestDiscussions, hasMore, loadMoreDiscussions } from '../../store/modules/discussion';
import { UserSelector } from '../../store/selectors/user';
import { getUser } from '../../modules/user/actions/getUser';

import Presenter from './presenter';

const discussionStateSelector = state => state.discussion;

const mapStateToProps = createSelector(
  [discussionStateSelector, UserSelector],
  (discussionState, userState) => ({
    discussions: discussionState.discussions
      .map(id => discussionState.discussionsById[id])
      .sort((a, b) => (new Date(b.date_update) - new Date(a.date_update))),
    hasMore: discussionState && hasMore(discussionState),
    isFetching: discussionState.isFetching,
    didInvalidate: discussionState.didInvalidate,
    isUserFetching: userState.isFetching,
    user: userState.user,
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestDiscussions,
  loadMore: loadMoreDiscussions,
  getUser,
  // deleteDiscussion: onDeleteMessage,
  // updateMessagesTags,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
