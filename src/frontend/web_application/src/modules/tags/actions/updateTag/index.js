import { updateTag as updateTagBase } from '../../../../store/modules/tag';

export const updateTag = ({ tag, original }) =>
  dispatch => dispatch(updateTagBase({ tag, original }))
    .then(response => response.payload.data);
