import { Component } from 'react';
import PropTypes from 'prop-types';
import { getTranslator, changeLocale, getLanguage } from '../../services/i18n';

class I18nProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    locale: PropTypes.string.isRequired,
  };
  static defaultProps = {
    children: null,
  };

  componentWillMount() {
    changeLocale(getTranslator().translator, getLanguage([this.props.locale]));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      changeLocale(getTranslator().translator, getLanguage([nextProps.locale]));
    }
  }

  render() {
    return this.props.children;
  }
}

export default I18nProvider;
