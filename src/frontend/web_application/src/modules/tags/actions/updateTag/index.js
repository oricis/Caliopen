import { updateTag as updateTagBase } from '../../../../store/modules/tag';
import { handleAxiosErrors } from '../../../error';

export const updateTag = ({ tag, original }) =>
  dispatch => dispatch(updateTagBase({ tag, original }))
    .then(response => response.payload.data)
    .catch(handleAxiosErrors);
