import React from 'react';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router-dom';
import App from '../../../src/App';

const Bootstrap = ({ store, config, ...props }) => (
  <StaticRouter {...props}>
    <App store={store} config={config} />
  </StaticRouter>
);

Bootstrap.propTypes = {
  store: PropTypes.shape({}).isRequired,
  config: PropTypes.shape({}),
};

Bootstrap.defaultProps = {
  config: {},
};

export default Bootstrap;
