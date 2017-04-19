import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Routes from './routes';

const App = (props) => {
  const { store } = props;

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

App.propTypes = {
  store: PropTypes.shape({}).isRequired,
};

export default App;
