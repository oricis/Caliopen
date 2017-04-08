import throttle from 'lodash.throttle';
import { EDIT_DRAFT, REQUEST_DRAFT, requestDraftSuccess, draftCreated } from '../modules/draft-message';
import { CREATE_MESSAGE_SUCCESS, createMessage, updateMessage, syncMessage } from '../modules/message';
import fetchLocation from '../../services/api-location';

const UPDATE_WAIT_TIME = 5 * 1000;

const forceAuthor = ({ addresses, participants }) => [...participants].map((participant) => {
  let type = participant.type === 'From' ? 'To' : participant.type;
  if (addresses.indexOf(participant.address) !== -1) {
    type = 'From';
  }

  return {
    ...participant,
    type,
  };
});

const normalizeDraft = ({ draft, user, discussion }) => {
  const { discussion_id } = discussion;
  const { contact: { emails } } = user;
  const addresses = emails.map(email => email.address);
  const participants = forceAuthor({ addresses, participants: discussion.participants });

  return {
    ...draft,
    discussion_id,
    participants,
  };
};

let throttled;
const createThrottle = ({ store, action }) => throttle(() => {
  const { draft, original } = action.payload;
  throttled = undefined;

  if (!draft.message_id) {
    const { discussionId } = action.payload;

    const {
      user: { user },
      discussion: {
        discussionsById: {
          [discussionId]: discussion,
        },
      },
    } = store.getState();

    return store.dispatch(createMessage({
      message: normalizeDraft({ draft, user, discussion }),
      original,
    }));
  }

  return store.dispatch(updateMessage({ message: draft, original }));
}, UPDATE_WAIT_TIME, { leading: false });

function createDraft(discussion) {
  const { discussion_id } = discussion;

  return {
    discussion_id,
    body: '',
  };
}

function manageRequestDraft({ store, action }) {
  const { discussionId } = action.payload;
  const {
    message: { messagesById },
  } = store.getState();

  const message = Object.keys(messagesById)
    .map(messageId => messagesById[messageId])
    .find(item => item.discussion_id === discussionId && item.is_draft)
    || createDraft(action.payload.discussionId);

  store.dispatch(requestDraftSuccess({ draft: message }));
}

export default store => next => (action) => {
  if (action.type === EDIT_DRAFT) {
    if (throttled) {
      throttled.cancel();
    }
  }

  if (action.type === CREATE_MESSAGE_SUCCESS && throttled) {
    throttled.cancel();
    throttled = undefined;
  }

  const result = next(action);

  if (action.type === EDIT_DRAFT) {
    throttled = createThrottle({ store, action });
    throttled();
  }

  if (action.type === REQUEST_DRAFT) {
    manageRequestDraft({ store, action });
  }

  if (action.type === CREATE_MESSAGE_SUCCESS) {
    const { location } = action.payload.data;
    fetchLocation(location).then((payload) => {
      store.dispatch(draftCreated({ draft: payload.data }));
      store.dispatch(syncMessage({ message: payload.data }));
    });
  }

  return result;
};
