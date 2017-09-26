import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { matchPath } from 'react-router-dom';
import { requestMessages, postActions, deleteMessage, invalidate, loadMore, hasMore as getHasMore } from '../../store/modules/message';
import { removeTab } from '../../store/modules/tab';
import Presenter from './presenter';

const getDiscussionIdFromProps = props => props.match.params.discussionId;

const messageByIdSelector = state => state.message.messagesById;
const discussionIdSelector = (state, ownProps) => getDiscussionIdFromProps(ownProps);
const currentTabSelector = createSelector(
  [state => state.tab.tabs, state => state.router.location && state.router.location.pathname],
  (tabs, pathname) => tabs.find(tab => matchPath(pathname, { path: tab.pathname, exact: true }))
);
const messageCollectionStateSelector = createSelector(
  [state => state.message.messagesCollections, discussionIdSelector],
  (collections, discussionId) => ({
    messageIds: (
      collections.discussion &&
      collections.discussion[discussionId] &&
      collections.discussion[discussionId].messages) || [],
    didInvalidate: (
      collections.discussion &&
      collections.discussion[discussionId] &&
      collections.discussion[discussionId].didInvalidate) || false,
    hasMore: (
      collections.discussion &&
      collections.discussion[discussionId] &&
      getHasMore(collections.discussion[discussionId])) || false,
    isFetching: (
      collections.discussion &&
      collections.discussion[discussionId] &&
      collections.discussion[discussionId].isFetching) || false,
  })
);

const mapStateToProps = createSelector(
  [messageByIdSelector, discussionIdSelector, currentTabSelector, messageCollectionStateSelector],
  (messagesById, discussionId, currentTab, { didInvalidate, messageIds, hasMore, isFetching }) => ({
    discussionId,
    didInvalidate,
    isFetching,
    hasMore,
    messages: messageIds
      .map(messageId => messagesById[messageId])
      .filter(message => message.is_draft !== true),
    currentTab,
  })
);

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  requestMessages: requestMessages.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  loadMore: loadMore.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  deleteMessage,
  invalidate: invalidate.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  setMessageRead: ({ message, isRead = true }) => {
    const action = isRead ? 'set_read' : 'set_unread';

    return postActions({ message, actions: [action] });
  },
  removeTab,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
