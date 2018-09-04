import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { requestMessages, loadMore } from '../../store/modules/message';
import { setMessageRead, deleteMessage } from '../../modules/message';
import { createMessageCollectionStateSelector } from '../../store/selectors/message';
import { UserSelector } from '../../store/selectors/user';
import { withCurrentTab, withCloseTab } from '../../modules/tab';
import { sortMessages } from '../../services/message';
import { getUser } from '../../modules/user/actions/getUser';
import withScrollManager from '../../modules/scroll/hoc/scrollManager';
import Discussion from './presenter';

const getDiscussionIdFromProps = props => props.match.params.discussionId;
const discussionIdSelector = (state, ownProps) => getDiscussionIdFromProps(ownProps);
const discussionSelector = state => state.discussion;

const messageByIdSelector = state => state.message.messagesById;
const messageCollectionStateSelector = createMessageCollectionStateSelector(() => 'discussion', discussionIdSelector);

const mapStateToProps = createSelector(
  [messageByIdSelector, discussionSelector,
    discussionIdSelector, UserSelector, messageCollectionStateSelector],
  (messagesById, discussionState, discussionId, userState, {
    messageIds, hasMore, isFetching,
  }) => {
    const messages = sortMessages(messageIds.map(messageId => messagesById[messageId]), false);

    return {
      discussionId,
      user: userState.user,
      isUserFetching: userState.isFetching,
      discussion: discussionState.discussionsById[discussionId] || {},
      messages,
      isFetching,
      hasMore,
    };
  }
);

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  requestMessages: requestMessages.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  loadMore: loadMore.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  setMessageRead,
  deleteMessage,
  getUser,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withScrollManager(),
  withCloseTab(),
  withCurrentTab(),
)(Discussion);
