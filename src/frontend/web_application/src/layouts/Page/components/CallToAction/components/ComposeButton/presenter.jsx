import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

class ComposeButton extends PureComponent {
  static propTypes = {
    __: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const { __, action, className } = this.props;
    const buttonProps = { className, icon: 'plus' };

    return (
      <ActionButton action={action} button={buttonProps}>
        {__('call-to-action.action.compose')}
      </ActionButton>
    );
  }
}

export default ComposeButton;
