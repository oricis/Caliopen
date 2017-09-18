import { Component } from 'react';
import PropTypes from 'prop-types';

class SettingsProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    requestSettings: PropTypes.func.isRequired,
  };
  static defaultProps = {
    children: null,
  };

  componentDidMount() {
    this.props.requestSettings();
  }

  render() {
    return this.props.children;
  }
}

export default SettingsProvider;
