import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { I18nProvider } from 'lingui-react';
import { unpackCatalog } from 'lingui-i18n';
import PageTitle from './components/PageTitle';
import Routes from './routes';
import I18nProviderLegacy from './components/I18nProvider';
import { initConfig } from './services/config';
import catalog from '../locale/en/messages';

// eslint-disable-next-line import/no-extraneous-dependencies
const linguiDev = process.env.NODE_ENV !== 'production' ? require('lingui-i18n/dev') : undefined;
// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  static propTypes = {
    store: PropTypes.shape({ dispatch: PropTypes.func.isRequired }).isRequired,
    config: PropTypes.shape({}),
  };

  static defaultProps = {
    config: {},
  };

  componentWillMount() {
    if (this.props.config) {
      initConfig(this.props.config);
    }
  }

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <I18nProviderLegacy>
          <I18nProvider language="en" catalogs={{ en: unpackCatalog(catalog) }} development={linguiDev}>
            <PageTitle />
            <Routes />
          </I18nProvider>
        </I18nProviderLegacy>
      </Provider>
    );
  }
}

export default App;
