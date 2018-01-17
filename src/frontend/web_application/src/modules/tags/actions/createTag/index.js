import { createTag as createTagBase } from '../../../../store/modules/tag';
import { handleAxiosErrors } from '../../../error';

export const createTag = tag => dispatch => dispatch(createTagBase({ tag }))
  .then(response => response.payload.data)
  .catch(handleAxiosErrors);
