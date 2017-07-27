import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { matchPath } from 'react-router-dom';
import { requestMessages, postActions, deleteMessage } from '../../store/modules/message';
import { requestDiscussion } from '../../store/modules/discussion';
import { removeTab } from '../../store/modules/tab';
import Presenter from './presenter';

const messageByIdSelector = state => state.message.messagesById;
const discussionIdSelector = (state, ownProps) => ownProps.match.params.discussionId;
const currentTabSelector = createSelector(
  [state => state.tab.tabs, state => state.router.location && state.router.location.pathname],
  (tabs, pathname) => tabs.find(tab => matchPath(pathname, { path: tab.pathname, exact: true }))
);

const mapStateToProps = createSelector(
  [messageByIdSelector, discussionIdSelector, currentTabSelector],
  (messagesById, discussionId, currentTab) => ({
    discussionId,
    messages: Object.keys(messagesById)
      .map(messageId => messagesById[messageId])
      .filter(message => message.discussion_id === discussionId && message.is_draft !== true),
    currentTab,
  })
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestDiscussion,
  requestMessages,
  deleteMessage,
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
