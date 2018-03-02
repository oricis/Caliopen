import { createAction, createSelector } from 'bouchon';
import { actions as devicesAction, selectors as devicesSelector } from '../devices';
const actions = {
  post: createAction('Authenticate'),
};

const selectors = {
  all: (params) => createSelector(
    [
      ({ authentications }) => authentications,
      devicesSelector.byId({ device_id: params.device.device_id }),
    ],
    (authentications, device) => ({
      ...authentications,
      device,
    })
  ),
};

const reducer = {};

const routes = {
  'POST /': {
    action: [devicesAction.createOnSignin, actions.post],
    selector: selectors.all,
    status: 200,
  },
};

export default {
  name: 'authentications',
  data: require('./data.json'),
  reducer: reducer,
  endpoint: '/api/v1/authentications',
  routes: routes,
};
