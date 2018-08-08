import { v4 as uuidv4 } from 'uuid';
import { getLocalIdentities } from '../../identity';
import { createDraft } from '../../../store/modules/draft-message';

export const newDraft = ({ internalId, draft: { body = '', message_id: messageId = uuidv4(), ...draftParams } = {} }) =>
  async (dispatch) => {
    // TODO: let the form decides which identity to use
    const localIdentities = await dispatch(getLocalIdentities());

    const draft = {
      message_id: messageId,
      body,
      user_identities: localIdentities.map((identity => identity.identity_id)),
      ...draftParams,
    };
    dispatch(createDraft({ internalId, draft }));

    return draft;
  };
