import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Routes from './routes';
import enableI18n from './services/i18n';

const I18nRoutes = enableI18n(Routes);
const App = (props) => {
  const { store } = props;

  return (
    <Provider store={store}>
      <I18nRoutes />
    </Provider>
  );
};

App.propTypes = {
  store: PropTypes.shape({}).isRequired,
};

export default App;
