import { routerMiddleware } from 'react-router-redux';
import getRouterHistory from '../../services/router-history';

export default routerMiddleware(getRouterHistory());
