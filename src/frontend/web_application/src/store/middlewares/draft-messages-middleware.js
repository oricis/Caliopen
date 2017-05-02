import throttle from 'lodash.throttle';
import isEqual from 'lodash.isequal';
import { EDIT_DRAFT, REQUEST_DRAFT, SAVE_DRAFT, SEND_DRAFT, requestDraftSuccess, draftCreated, clearDraft } from '../modules/draft-message';
import { CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_FAIL, POST_ACTIONS_SUCCESS, requestMessages, createMessage, updateMessage, syncMessage, postActions } from '../modules/message';
import { requestLocalIdentities } from '../modules/local-identity';
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

const manageCreateOrUpdateResult = async ({ result: action, store }) => {
  if (action.type === CREATE_MESSAGE_SUCCESS) {
    const { location } = action.payload.data;
    const { data: message } = await fetchLocation(location);
    await store.dispatch(draftCreated({ draft: message }));
    await store.dispatch(syncMessage({ message }));

    return message;
  }

  if (action.type === UPDATE_MESSAGE_SUCCESS) {
    const location = action.meta.previousAction.payload.request.url;
    const { data: message } = await fetchLocation(location);
    await store.dispatch(syncMessage({ message }));

    return message;
  }

  if (action.type === UPDATE_MESSAGE_FAIL) {
    // FIXME use global notification
    throw new Error('Unable to update, may be the message has been modified somewhere else');
  }

  throw new Error(`Uknkown type ${action.type} in manageCreateOrUpdateResult`);
};

const createOrUpdateDraft = async ({ draft, discussionId, store, original }) => {
  let result;
  if (draft.message_id) {
    result = await store.dispatch(updateMessage({
      message: draft, original,
    }));
  } else {
    const {
      user: { user },
      discussion: {
        discussionsById: {
          [discussionId]: discussion,
        },
      },
    } = store.getState();

    result = await store.dispatch(createMessage({
      message: normalizeDraft({ draft, user, discussion }),
      original,
    }));
  }

  return manageCreateOrUpdateResult({ result, store });
};

let throttled;
const createThrottle = ({ store, action }) => throttle(() => {
  throttled = undefined;
  const { draft, original, discussionId } = action.payload;

  return createOrUpdateDraft({ draft, discussionId, store, original });
}, UPDATE_WAIT_TIME, { leading: false });

function getDefaultIdentities({ protocols, identities }) {
  return identities.reduce((acc, identity) => {
    if (
      protocols.indexOf(identity.type) !== -1 &&
      acc.filter(ident => ident.type === identity.type).length === 0
    ) {
      acc.push(identity);
    }

    return acc;
  }, []);
}

async function getNewDraft({ discussionId, store, messageToAnswer }) {
  await store.dispatch(requestLocalIdentities());
  const { localIdentities } = store.getState().localIdentity;

  return {
    discussion_id: discussionId,
    body: '',
    participants: [],
    identities: getDefaultIdentities({ protocols: ['email'], identities: localIdentities }),
    subject: messageToAnswer && messageToAnswer.subject,
  };
}

async function manageRequestDraft({ store, action }) {
  const { discussionId } = action.payload;
  await store.dispatch(requestMessages({ discussionId }));

  const {
    message: { messagesById },
  } = store.getState();

  const messages = Object.keys(messagesById)
    .map(messageId => messagesById[messageId])
    .filter(item => item.discussion_id === discussionId);

  const message = messages.find(item => item.is_draft)
    || await getNewDraft({ discussionId, store, messageToAnswer: messages[0] });

  return store.dispatch(requestDraftSuccess({ draft: message }));
}

export default store => next => (action) => {
  if (action.type === EDIT_DRAFT) {
    if (throttled) {
      throttled.cancel();
    }
  }

  if ([CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS].indexOf(action.type) !== -1 && throttled) {
    throttled.cancel();
    throttled = undefined;
  }

  const result = next(action);

  if (action.type === EDIT_DRAFT) {
    throttled = createThrottle({ store, action });
    throttled();
  }

  if (action.type === SAVE_DRAFT) {
    const { draft, discussionId, original } = action.payload;

    return createOrUpdateDraft({ draft, discussionId, store, original });
  }

  if (action.type === REQUEST_DRAFT) {
    manageRequestDraft({ store, action });
  }

  if (action.type === SEND_DRAFT) {
    const { draft, discussionId, original } = action.payload;
    const getMessage = async () => {
      if (isEqual(draft, original)) {
        return draft;
      }

      return createOrUpdateDraft({ draft, discussionId, store, original });
    };

    getMessage()
      .then(message => store.dispatch(postActions({ message, actions: ['send'] })))
      .then((postActionsAction) => {
        if (postActionsAction.type === POST_ACTIONS_SUCCESS) {
          const { payload: { data: message } } = postActionsAction;

          return store.dispatch(clearDraft({ discussionId: message.discussion_id }));
        }

        throw new Error('Fail to send');
      });
  }

  return result;
};
