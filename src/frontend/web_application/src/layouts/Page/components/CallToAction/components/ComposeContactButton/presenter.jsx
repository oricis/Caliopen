import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import ActionButton from '../ActionButton';

class ComposeContactButton extends PureComponent {
  static propTypes = {
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
    const { className } = this.props;
    const buttonProps = {
      icon: 'comment-o',
      className,
    };

    return (
      <ActionButton action={this.handleEventAction} button={buttonProps}>
        <Trans id="call-to-action.action.compose_contact">Compose to this contact</Trans>
      </ActionButton>
    );
  }
}

export default ComposeContactButton;
