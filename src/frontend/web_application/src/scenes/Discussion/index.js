import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { loadMore, invalidate, deleteMessage as deleteMessageRaw } from '../../store/modules/message';
import {
  setMessageRead, deleteMessage, requestDiscussion, sortMessages, getLastMessageFromArray,
} from '../../modules/message';
import { reply } from '../../modules/draftMessage';
import { createMessageCollectionStateSelector } from '../../store/selectors/message';
import { UserSelector } from '../../store/selectors/user';
import { withTags, updateTagCollection } from '../../modules/tags';
import { getUser } from '../../modules/user/actions/getUser';
import { withPush } from '../../modules/routing/hoc/withPush';
import Discussion from './presenter';

const getDiscussionIdFromProps = props => props.match.params.discussionId;
const discussionIdSelector = (state, ownProps) => getDiscussionIdFromProps(ownProps);
const discussionStateSelector = state => state.discussion;

const messageByIdSelector = state => state.message.messagesById;
const messageCollectionStateSelector = createMessageCollectionStateSelector(() => 'discussion', discussionIdSelector);
const sortedMessagesSelector = createSelector(
  [messageByIdSelector, messageCollectionStateSelector],
  (messagesById, { messageIds }) => sortMessages(
    messageIds.map(messageId => messagesById[messageId])
      .filter(msg => msg.is_draft === false),
    false
  )
);

const lastMessageSelector = createSelector(
  [sortedMessagesSelector],
  sortedMessages => getLastMessageFromArray(sortedMessages)
);
const firstUnreadMessageSelector = createSelector(
  [sortedMessagesSelector],
  sortedMessages => sortedMessages.filter(message => message.is_unread)[0]
);

const mapStateToProps = createSelector(
  [sortedMessagesSelector, lastMessageSelector, firstUnreadMessageSelector, messageByIdSelector,
    discussionStateSelector, discussionIdSelector, UserSelector, messageCollectionStateSelector],
  (sortedMessages, lastMessage, firstUnreadMessage, messagesById, discussionState, discussionId,
    userState, {
      didInvalidate, messageIds, hasMore, isFetching,
    }) => {
    const canBeClosed = messageIds.length === 0;

    return {
      discussionId,
      user: userState.user,
      isUserFetching: userState.isFetching,
      discussion: discussionState.discussionsById[discussionId],
      messages: sortedMessages,
      isFetching,
      didInvalidate,
      hasMore,
      canBeClosed,
      lastMessage,
      firstUnreadMessage,
    };
  }
);

const deleteDiscussion = ({ discussionId, messages }) => async (dispatch) => {
  await Promise.all(messages.map(message => dispatch(deleteMessageRaw({ message }))));

  return dispatch(invalidate('discussion', discussionId));
};

const updateDiscussionTags = ({ i18n, messages, tags }) => async dispatch => (
  Promise.all(messages.map(message => (
    dispatch(updateTagCollection(i18n, { type: 'message', entity: message, tags }))
  )))
);

const onMessageReply = ({ message, discussionId }) => async (dispatch) => {
  dispatch(reply({ internalId: discussionId, message }));
};

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  loadMore: loadMore.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  setMessageRead,
  deleteMessage,
  deleteDiscussion,
  requestDiscussion:
    requestDiscussion.bind(null, { discussionId: getDiscussionIdFromProps(ownProps) }),
  updateDiscussionTags,
  onMessageReply,
  getUser,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTags(),
  withPush(),
)(Discussion);
