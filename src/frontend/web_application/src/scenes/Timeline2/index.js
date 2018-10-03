import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import withScrollManager from '../../modules/scroll/hoc/scrollManager';
import { requestDiscussions, hasMore, loadMoreDiscussions } from '../../store/modules/discussion';
import { UserSelector } from '../../store/selectors/user';
import { getUser } from '../../modules/user/actions/getUser';

import Presenter from './presenter';

const discussionSelector = state => state.discussion;

const mapStateToProps = createSelector(
  [discussionSelector, UserSelector],
  (discussion, userState) => ({
    discussions: discussion.discussions.map(id => discussion.discussionsById[id]),
    hasMore: discussion && hasMore(discussion),
    isFetching: discussion.isFetching,
    // didInvalidate: timeline && timeline.didInvalidate,
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  //  withTags(),
  withScrollManager(),
)(Presenter);
