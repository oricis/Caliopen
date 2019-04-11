import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Spinner } from '../../../../components';
import { capitalize } from '../../../../services/capitalize';
import {
  PROVIDER_GMAIL, PROVIDER_TWITTER, withAuthorize, ProviderIcon,
} from '../../../../modules/remoteIdentity';
import ProviderButton from '../ProviderButton';
import './style.scss';

@withAuthorize()
class AuthButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    onDone: PropTypes.func.isRequired,
    authorize: PropTypes.func.isRequired,
    providerName: PropTypes.oneOf([PROVIDER_GMAIL, PROVIDER_TWITTER]).isRequired,
  };

  static defaultProps = {
    className: undefined,
  };

  state = {
    hasActivity: false,
  };

  authorize = async () => {
    const { authorize, onDone, providerName } = this.props;

    this.setState({
      hasActivity: true,
    });

    try {
      const result = await authorize({ providerName });

      onDone(result);
    } catch (err) {
      onDone(err);
    } finally {
      this.setState({
        hasActivity: false,
      });
    }
  }

  render() {
    const { className, providerName } = this.props;

    return (
      <ProviderButton
        onClick={this.authorize}
        shape="plain"
        className={classnames(className, 'm-oauth-button')}
        disabled={this.state.hasActivity}
      >
        {this.state.hasActivity ? (<Spinner isloading />) : (
          <ProviderIcon className="m-oauth-button__logo" providerName={providerName} />
        )}
        {capitalize(providerName)}
      </ProviderButton>
    );
  }
}

export default AuthButton;
