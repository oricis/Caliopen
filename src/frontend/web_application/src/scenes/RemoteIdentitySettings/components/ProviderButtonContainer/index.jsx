import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

class ProviderButtonContainer extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    label: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    label: null,
    className: undefined,
  };

  render() {
    const { className, children, label } = this.props;

    return (
      <div className={classnames(className, 'm-provider-button-container')}>
        <div className="m-provider-button-container__button">{children}</div>
        <div className="m-provider-button-container__label">{label}</div>
      </div>
    );
  }
}

export default ProviderButtonContainer;
