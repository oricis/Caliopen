import { getLocalIdentities } from '../../identity';
import { createDraft } from '../../../store/modules/draft-message';

export const newDraft = ({ internalId, draft }) =>
  async (dispatch) => {
    // TODO: let the form decides which identity to use
    const localIdentities = await dispatch(getLocalIdentities());
    const nextDraft = {
      ...draft,
      user_identities: localIdentities.map((identity => identity.identity_id)),
    };

    dispatch(createDraft({
      internalId,
      draft: nextDraft,
    }));

    return nextDraft;
  };
