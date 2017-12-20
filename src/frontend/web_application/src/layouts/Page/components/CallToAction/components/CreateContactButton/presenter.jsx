import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import ActionButton from '../ActionButton';

class ComposeContactButton extends PureComponent {
  static propTypes = {
    action: PropTypes.func.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const { action, className } = this.props;
    const buttonProps = {
      icon: 'user',
      className,
    };

    return (
      <ActionButton action={action} button={buttonProps}>
        <Trans id="call-to-action.action.create_contact">call-to-action.action.create_contact</Trans>
      </ActionButton>
    );
  }
}

export default ComposeContactButton;
