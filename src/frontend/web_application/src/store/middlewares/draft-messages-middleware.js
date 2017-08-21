import throttle from 'lodash.throttle';
import isEqual from 'lodash.isequal';
import { push, replace } from 'react-router-redux';
import { createNotification, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';
import { REQUEST_NEW_DRAFT, REQUEST_NEW_DRAFT_SUCCESS, REQUEST_DRAFT, EDIT_DRAFT, SEND_DRAFT, requestNewDraftSuccess, requestDraftSuccess, syncDraft, clearDraft } from '../modules/draft-message';
import { CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_FAIL, POST_ACTIONS_SUCCESS, requestMessages, requestMessage, createMessage, updateMessage, postActions } from '../modules/message';
import { requestLocalIdentities } from '../modules/local-identity';
import { removeTab, updateTab } from '../modules/tab';
import fetchLocation from '../../services/api-location';
import { getTranslator } from '../../services/i18n';

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

const normalizeDiscussionDraft = ({ draft, user, discussion }) => {
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

const getMessageUpToDate = async ({ store, messageId }) => {
  await store.dispatch(requestMessage({ messageId }));

  return store.getState().message.messagesById[messageId];
};

const createDraft = async ({ internalId, draft, discussionId, store }) => {
  let normalizedDraft = draft;

  if (discussionId) {
    const {
      user: { user },
      discussion: {
        discussionsById: {
          [discussionId]: discussion,
        },
      },
    } = store.getState();

    normalizedDraft = normalizeDiscussionDraft({ draft, user, discussion });
  }

  const resultAction = await store.dispatch(createMessage({ message: normalizedDraft }));

  if (resultAction.type === CREATE_MESSAGE_SUCCESS) {
    const { location } = resultAction.payload.data;
    const { data: message } = await fetchLocation(location);
    await store.dispatch(syncDraft({ internalId, draft: message }));

    return getMessageUpToDate({ store, messageId: message.message_id });
  }

  throw new Error(`Unexpected type ${resultAction.type} in createDraft`);
};

const updateDraft = async ({ draft, original, store }) => {
  const resultAction = await store.dispatch(updateMessage({
    message: draft, original,
  }));

  if (resultAction.type === UPDATE_MESSAGE_SUCCESS) {
    return getMessageUpToDate({ store, messageId: draft.message_id });
  }

  if (resultAction.type === UPDATE_MESSAGE_FAIL) {
    const { translate: __ } = getTranslator();
    const notification = {
      message: __('message.feedbak.update_fail'), // Unable to update, may be the message has been modified somewhere else
      type: NOTIFICATION_TYPE_ERROR,
      duration: 0,
      canDismiss: true,
    };
    store.dispatch(createNotification(notification));
  }

  throw new Error(`Uknkown type ${resultAction.type} in updateDraft`);
};

const createOrUpdateDraft = async ({ internalId, draft, discussionId, store, original }) => {
  if (draft.message_id) {
    return updateDraft({ draft, original, store });
  }

  return createDraft({ internalId, draft, discussionId, store });
};

let throttled;
const createThrottle = ({ store, action, callback = message => message }) => throttle(() => {
  throttled = undefined;
  const { draft, original, discussionId, internalId } = action.payload;

  createOrUpdateDraft({ internalId, draft, discussionId, store, original })
    .then(message => callback(message));
}, UPDATE_WAIT_TIME, { leading: false });

function getDefaultIdentities({ protocols, identities = [] }) {
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

const localIdentityToIdentity = ({ identifier, type }) => ({ identifier, type });

async function getNewDraft({ discussionId, store, messageToAnswer }) {
  await store.dispatch(requestLocalIdentities());
  const { localIdentities } = store.getState().localIdentity;

  return {
    ...(discussionId ? { discussion_id: discussionId } : {}),
    ...(messageToAnswer && messageToAnswer.subject ? { subject: messageToAnswer.subject } : {}),
    body: '',
    participants: [],
    identities: getDefaultIdentities({ protocols: ['email'], identities: localIdentities })
      .map(localIdentityToIdentity),
  };
}

async function requestDraftHandler({ store, action }) {
  if (action.type !== REQUEST_DRAFT) {
    return;
  }

  const { internalId, discussionId } = action.payload;
  await store.dispatch(requestMessages({ discussionId }));

  const {
    message: { messagesById },
  } = store.getState();

  const messages = Object.keys(messagesById)
    .map(messageId => messagesById[messageId])
    .filter(item => item.discussion_id === discussionId);

  const message = messages.find(item => item.is_draft)
    || await getNewDraft({ discussionId, store, messageToAnswer: messages[0] });

  store.dispatch(requestDraftSuccess({ internalId, draft: message }));
}

async function requestNewDraftHandler({ store, action }) {
  if (action.type !== REQUEST_NEW_DRAFT) {
    return;
  }

  const { internalId } = action.payload;
  const draft = await getNewDraft({ store });

  store.dispatch(requestNewDraftSuccess({ internalId, draft }));
}

const requestNewDraftSuccessHandler = ({ store, action }) => {
  if (action.type !== REQUEST_NEW_DRAFT_SUCCESS) {
    return;
  }
  const { router: { location: { pathname } }, tab: { tabs } } = store.getState();

  if (pathname !== '/compose') {
    return;
  }

  const original = tabs.find(tab => tab.pathname === pathname);
  const { internalId } = action.payload;
  const newPathname = `/compose/${internalId}`;
  const tab = { ...original, pathname: newPathname };
  store.dispatch(updateTab({ tab, original }));
  store.dispatch(replace(newPathname));
};

const editDraftHandler = ({ store, action }) => {
  if (action.type !== EDIT_DRAFT) {
    return;
  }
  throttled = createThrottle({ store, action });
  throttled();
};

const sendDraftHandler = async ({ store, action }) => {
  if (action.type !== SEND_DRAFT) {
    return;
  }

  const { internalId, draft, discussionId, original } = action.payload;
  const getMessage = async () => {
    if (isEqual(draft, original)) {
      return draft;
    }

    return createOrUpdateDraft({ internalId, draft, discussionId, store, original });
  };

  const message = await getMessage();
  const postActionsAction = await store.dispatch(postActions({ message, actions: ['send'] }));
  if (postActionsAction.type !== POST_ACTIONS_SUCCESS) {
    throw new Error('Fail to send');
  }

  if (store.getState().router.location.pathname === `/compose/${internalId}`) {
    store.dispatch(push(`/discussions/${message.discussion_id}`));
  }

  const tab = store.getState().tab.tabs
    .find(currentTab => currentTab.pathname === `/compose/${internalId}`);

  if (tab) {
    store.dispatch(removeTab(tab));
  }

  store.dispatch(clearDraft({ internalId }));
};

export default store => next => (action) => {
  if ([EDIT_DRAFT].indexOf(action.type) !== -1) {
    if (throttled) {
      throttled.cancel();
    }
  }

  if ([CREATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_SUCCESS].indexOf(action.type) !== -1 && throttled) {
    throttled.cancel();
    throttled = undefined;
  }

  const result = next(action);

  editDraftHandler({ store, action });
  requestDraftHandler({ store, action });
  sendDraftHandler({ store, action });
  requestNewDraftHandler({ store, action });
  requestNewDraftSuccessHandler({ store, action });

  return result;
};
