import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Button } from '../../../../components/';

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

    return (
      <Button shape="plain" onClick={action} className={className} icon="pencil">
        <Trans id="call-to-action.action.compose">Compose</Trans>
      </Button>
    );
  }
}

export default ComposeButton;
