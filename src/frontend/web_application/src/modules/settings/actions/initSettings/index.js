import { requestSettings } from '../../../../store/modules/settings';

export const initSettings = () => dispatch =>
  dispatch(requestSettings()).then(response => response.payload.data);
