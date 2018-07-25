import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Button } from '../../../../components/';

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

    return (
      <Button shape="plain" onClick={action} className={className} icon="user">
        <Trans id="call-to-action.action.create_contact">Create a contact</Trans>
      </Button>
    );
  }
}

export default ComposeContactButton;
