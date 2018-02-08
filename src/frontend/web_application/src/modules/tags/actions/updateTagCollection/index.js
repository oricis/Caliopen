import isEqual from 'lodash.isequal';
import { requestMessage, updateTags as updateMessageTags } from '../../../../store/modules/message';
import { requestContact, updateTags as updateContactTags } from '../../../../store/modules/contact';
import { tryCatchAxiosAction } from '../../../../services/api-client';
import { requestTags } from '../requestTags';
import { createTag } from '../createTag';
import { getTagLabel } from '../../services/getTagLabel';

const getUpdateAction = (type) => {
  switch (type) {
    case 'message':
      return updateMessageTags;
    case 'contact':
      return updateContactTags;
    default:
      throw new Error(`Entity ${type} not supported`);
  }
};

export const updateTags = (type, entity, { tags }) => (dispatch) => {
  const action = getUpdateAction(type);

  return tryCatchAxiosAction(() => dispatch(action({ [type]: entity, tags })));
};

const getTagFromLabel = (i18n, tags, label) =>
  tags.find(tag => getTagLabel(i18n, tag).toLowerCase() === label.toLowerCase());

const createMissingTags = (i18n, userTags, tagCollection) => async (dispatch) => {
  const knownLabels = userTags.map(tag => getTagLabel(i18n, tag).toLowerCase());
  const newTags = tagCollection
    .filter(tag => !tag.name)
    .filter(tag => !knownLabels.includes(getTagLabel(i18n, tag).toLowerCase()));

  if (!newTags.length) {
    return userTags;
  }

  await Promise.all(newTags.map(tag => dispatch(createTag(tag))));

  return dispatch(requestTags());
};

const getRequestEntityAct = (type) => {
  switch (type) {
    case 'message':
      return requestMessage;
    case 'contact':
      return requestContact;
    default:
      throw new Error(`Entity ${type} not supported`);
  }
};

export const updateTagCollection = (i18n, userTags, { type, entity, tags: tagCollection }) =>
  async (dispatch) => {
    const upToDateTags = await dispatch(createMissingTags(i18n, userTags, tagCollection));
    const normalizedTags = tagCollection.reduce((acc, tag) => [
      ...acc,
      !tag.name ? getTagFromLabel(i18n, upToDateTags, tag.label) : tag,
    ], []);
    const tagNames = normalizedTags.map(tag => tag.name);

    if (!isEqual(entity.tags, tagCollection.map(tag => tag.name))) {
      const request = getRequestEntityAct(type);

      await dispatch(updateTags(type, entity, {
        tags: tagNames,
      }));

      return tryCatchAxiosAction(() => dispatch(request(entity[`${type}_id`])));
    }

    return entity;
  };
