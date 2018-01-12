import { deleteTag as deleteTagBase } from '../../../../store/modules/tag';
import { handleAxiosErrors } from '../../../error';

export const deleteTag = ({ tag }) => dispatch => dispatch(deleteTagBase({ tag }))
  .then(response => response.payload.data)
  .catch(handleAxiosErrors);
