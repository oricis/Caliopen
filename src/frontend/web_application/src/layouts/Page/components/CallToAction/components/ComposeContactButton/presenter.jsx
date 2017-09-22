import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

class ComposeContactButton extends PureComponent {
  static propTypes = {
    __: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  handleEventAction = () => {
    this.props.notify({
      message: 'Compose to contact is not yet implemented.',
    });
  }

  render() {
    const { __, className } = this.props;
    const buttonProps = {
      icon: 'comment-o',
      className,
    };

    return (
      <ActionButton action={this.handleEventAction} button={buttonProps}>
        {__('call-to-action.action.compose_contact')}
      </ActionButton>
    );
  }
}

export default ComposeContactButton;
