import { deleteTag as deleteTagBase } from '../../../../store/modules/tag';

export const deleteTag = ({ tag }) => dispatch => dispatch(deleteTagBase({ tag }))
  .then(response => response.payload.data);
