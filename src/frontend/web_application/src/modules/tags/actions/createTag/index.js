import { createTag as createTagBase } from '../../../../store/modules/tag';

export const createTag = tag => (dispatch) => {
  const data = {
    ...tag,
    name: tag.name || tag.label.toLowerCase(),
  };

  return dispatch(createTagBase({ tag: data }))
    .then(response => response.payload.data);
};
