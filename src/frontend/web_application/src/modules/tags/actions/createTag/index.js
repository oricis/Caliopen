import { createTag as createTagBase } from '../../../../store/modules/tag';

export const createTag = tag => dispatch => dispatch(createTagBase(tag))
  .then(response => response.payload.data);
