import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Routes from './routes';
import enableI18n from './services/i18n';
import { requestLocale } from './store/modules/i18n';

const I18nRoutes = enableI18n(Routes);

class App extends Component {
  static propTypes = {
    store: PropTypes.shape({ dispatch: PropTypes.func.isRequired }).isRequired,
  };

  componentDidMount() {
    this.props.store.dispatch(requestLocale());
  }

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <I18nRoutes />
      </Provider>
    );
  }
}

export default App;
