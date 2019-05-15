import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sha1 from 'uuid/lib/sha1-browser';
import bytesToUuid from 'uuid/lib/bytesToUuid';
import isEqual from 'lodash.isequal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getModuleStateSelector } from '../../../../store/selectors/getModuleStateSelector';
import { createMessageCollectionStateSelector } from '../../../../store/selectors/message';
import { draftSelector } from '../../../../modules/draftMessage';
import { requestDiscussionIdForParticipants } from '../../../../modules/discussion';
import { requestDiscussion } from '../../../../modules/message';
import { withIdentities } from '../../../../modules/identity';
import { withUser } from '../../../../modules/user';

const getParticipantsHash = ({ participants }) => {
  if (participants.length === 0) {
    return undefined;
  }

  return bytesToUuid(sha1(participants
    .map(participant => `${participant.address}_${participant.protocol}`)
    .sort()
    .join('+')));
};
const discussionStateSelector = getModuleStateSelector('discussion');
const messageStateSelector = getModuleStateSelector('message');
const draftMessageSelector = (state, { messageId }) => (
  draftSelector(state, { internalId: messageId })
);
const discussionIdSelector = createSelector(
  [discussionStateSelector, draftMessageSelector],
  (discussionState, draftMessage) => {
    if (!draftMessage || !draftMessage.participants || draftMessage.participants.length === 0) {
      return undefined;
    }

    const { participants } = draftMessage;
    const { discussionId } = discussionState.discussionByParticipantsHash[getParticipantsHash({
      participants,
    })] || {};

    return discussionId;
  }
);
const discussionSelector = createSelector(
  [discussionIdSelector, discussionStateSelector],
  (discussionId, discussionState) => discussionState.discussionsById[discussionId]
);
const messageCollectionStateSelector = createMessageCollectionStateSelector(() => 'discussion', discussionIdSelector);

const mapStateToProps = createSelector(
  [discussionSelector, messageCollectionStateSelector, messageStateSelector, draftMessageSelector],
  (discussion, messageCollectionState, messageState, draftMessage) => ({
    draftMessage,
    discussion,
    messages: messageCollectionState.messages,
  })
);

const requestDraftDiscussion = ({ participants, internalHash }) => async (dispatch) => {
  const discussionId = await dispatch(requestDiscussionIdForParticipants({
    participants, internalHash,
  }));
  if (discussionId && discussionId.length > 0) {
    dispatch(requestDiscussion({ discussionId }));
  }
};

const mapDispatchToProps = dispatch => bindActionCreators({
  requestDraftDiscussion,
}, dispatch);

const connecting = connect(mapStateToProps, mapDispatchToProps);

export const withDraftDiscussion = () => (C) => {
  @withUser()
  @withIdentities({ namespace: 'idents' })
  @connecting
  class WithDraftDiscussion extends Component {
    static propTypes = {
      requestDraftDiscussion: PropTypes.func.isRequired,
      draftMessage: PropTypes.shape({
        participants: PropTypes.arrayOf(PropTypes.shape({})),
      }),
      discussion: PropTypes.shape({}),
      messages: PropTypes.arrayOf(PropTypes.shape({})),
      // user: PropTypes.shape({}).isRequired,
      idents: PropTypes.shape({
        identities: PropTypes.arrayOf(PropTypes.shape({})),
      }).isRequired,
      userState: PropTypes.shape({
        user: PropTypes.shape({}).isRequired,
      }).isRequired,
    };

    static defaultProps = {
      draftMessage: undefined,
      discussion: undefined,
      messages: [],
    }

    componentDidMount() {
      const { draftMessage } = this.props;

      if (draftMessage) {
        this.fetchDiscussion();
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.draftMessage && (!prevProps.draftMessage || !isEqual(
          prevProps.draftMessage.participants, this.props.draftMessage.participants
        ))
      ) {
        this.fetchDiscussion();
      }
    }

    fetchDiscussion = () => {
      const { draftMessage } = this.props;
      const { participants } = draftMessage;

      if (participants && participants.length > 0) {
        this.props.requestDraftDiscussion({
          participants,
          internalHash: getParticipantsHash({ participants }),
        });
      }
    }

    render() {
      const {
        requestDraftDiscussion: unused, draftMessage, discussion, messages, ...props
      } = this.props;

      const draftDiscussionProps = {
        // draftMessage,
        discussion,
        messages,
      };

      return (
        <C draftDiscussion={draftDiscussionProps} {...props} />
      );
    }
  }

  return WithDraftDiscussion;
};
