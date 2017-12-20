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
      message: 'Reply to thread is not yet implemented.',
    });
  }

  render() {
    const { className } = this.props;
    const buttonProps = {
      icon: 'reply',
      className,
    };

    return (
      <ActionButton action={this.handleEventAction} button={buttonProps}>
        <Trans id="call-to-action.action.reply">call-to-action.action.reply</Trans>
      </ActionButton>
    );
  }
}

export default ComposeContactButton;
