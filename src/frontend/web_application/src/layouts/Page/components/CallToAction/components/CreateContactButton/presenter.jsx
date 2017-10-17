import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

class ComposeContactButton extends PureComponent {
  static propTypes = {
    __: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const { action, __, className } = this.props;
    const buttonProps = {
      icon: 'user',
      className,
    };

    return (
      <ActionButton action={action} button={buttonProps}>
        {__('call-to-action.action.create_contact')}
      </ActionButton>
    );
  }
}

export default ComposeContactButton;
