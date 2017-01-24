import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import rootReducer from './reducer';
import config from '../services/config';

const client = axios.create({
  baseURL: config.getAPIBaseUrl(),
  responseType: 'json',
});

const middlewares = [
  routerMiddleware(browserHistory),
  axiosMiddleware(client),
];

if (CALIOPEN_ENV === 'development' || CALIOPEN_ENV === 'staging') {
  middlewares.push(require('./middlewares/freeze').default); // eslint-disable-line
}

if (BUILD_TARGET === 'browser') {
  middlewares.push(require('./middlewares/openpgp-middleware').default); // eslint-disable-line
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

function configureStore(initialState, extension) {
  return createStoreWithMiddleware(rootReducer, initialState, extension);
}

export default configureStore;
