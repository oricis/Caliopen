import React from 'react';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router-dom';
import App from '../../../src/App';

const Bootstrap = ({ store, ...props }) => (
  <StaticRouter {...props}>
    <App store={store} />
  </StaticRouter>
);

Bootstrap.propTypes = {
  store: PropTypes.shape({}).isRequired,
};

export default Bootstrap;
