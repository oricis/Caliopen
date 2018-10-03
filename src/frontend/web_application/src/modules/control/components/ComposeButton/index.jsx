import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { withPush } from '../../../../modules/routing';
import { Button } from '../../../../components/';

@withPush()
class ComposeButton extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  handleClick = () => {
    this.props.push('/compose');
  }

  render() {
    const { className } = this.props;

    return (
      <Button shape="plain" onClick={this.handleClick} className={className} icon="pencil">
        <Trans id="call-to-action.action.compose">Compose</Trans>
      </Button>
    );
  }
}

export default ComposeButton;
