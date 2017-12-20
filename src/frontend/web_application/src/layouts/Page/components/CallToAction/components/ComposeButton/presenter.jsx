import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import ActionButton from '../ActionButton';

class ComposeButton extends PureComponent {
  static propTypes = {
    action: PropTypes.func.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const { action, className } = this.props;
    const buttonProps = { className, icon: 'plus' };

    return (
      <ActionButton action={action} button={buttonProps}>
        <Trans id="call-to-action.action.compose">call-to-action.action.compose</Trans>
      </ActionButton>
    );
  }
}

export default ComposeButton;
