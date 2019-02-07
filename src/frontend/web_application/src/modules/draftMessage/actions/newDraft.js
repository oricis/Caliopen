import { getDefaultIdentity } from './getDefaultIdentity';
import { getMessage } from '../../message';
import { createDraft } from '../../../store/modules/draft-message';

export const newDraft = ({ internalId, draft }) =>
  async (dispatch) => {
    let parentMessage;
    try {
      parentMessage = draft.parent_id ?
        await dispatch(getMessage({ messageId: draft.parent_id })) :
        undefined;
    } catch (err) {
      // no parentMessage
    }
    const localIdentity = await dispatch(getDefaultIdentity({ parentMessage }));
    const nextDraft = {
      ...draft,
      user_identities: [
        ...(localIdentity ? [localIdentity.identity_id] : []),
      ],
      // FIXME: cf. #1111
      // protocol: localIdentity && localIdentity.protocol,
    };

    dispatch(createDraft({
      internalId,
      draft: nextDraft,
    }));

    return nextDraft;
  };
