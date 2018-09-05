import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
// FIXME: looks like a cyclic dependency
// import { withPush } from '../../../../modules/routing';
import { withRouter } from 'react-router-dom';
// ---
import { Button } from '../../../../components/';

@withRouter
class ComposeButton extends PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  handleClick = () => {
    this.props.history.push('/compose');
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
