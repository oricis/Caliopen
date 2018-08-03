import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import Presenter from './presenter';
import withScrollManager from '../../modules/scroll/hoc/scrollManager';
import { requestDiscussions, hasMore, loadMoreDiscussions } from '../../store/modules/discussion';
import { UserSelector } from '../../store/selectors/user';

const discussionSelector = state => state.discussion;

const mapStateToProps = createSelector(
  [discussionSelector, UserSelector],
  (discussion, userState) => ({
    discussions: discussion.discussions.map(id => discussion.discussionsById[id]),
    hasMore: discussion && hasMore(discussion),
    isFetching: discussion.isFetching,
    // didInvalidate: timeline && timeline.didInvalidate,
    user: userState.user,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestDiscussions,
  loadMore: loadMoreDiscussions,
  // deleteDiscussion: onDeleteMessage,
  // updateMessagesTags,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withI18n(),
  //  withTags(),
  withScrollManager(),
)(Presenter);
