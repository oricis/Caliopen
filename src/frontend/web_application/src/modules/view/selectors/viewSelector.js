import { createSelector } from 'reselect';
import { getModuleStateSelector } from '../../../store/selectors/getModuleStateSelector';

const viewIdSelector = (state, { viewId }) => {
  if (!viewId) {
    throw new Error('viewId must be defined in component properties');
  }

  return viewId;
};

export const viewModelSelector = createSelector(
  [viewIdSelector, getModuleStateSelector('view')],
  (viewId, viewState) => viewState[viewId]
);
