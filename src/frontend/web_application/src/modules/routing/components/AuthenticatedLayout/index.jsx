import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { AppLoader } from '../../../../components';
import { withAuthenticatedProps } from './withAuthenticatedProps';

@withRouter
@withAuthenticatedProps()
class AuthenticatedLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({}),
    settings: PropTypes.shape({}),
    isFetching: PropTypes.bool.isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
    didLostAuth: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    user: undefined,
    settings: undefined,
  };
  state = {
    initialized: false,
  };

  componentWillReceiveProps(nextProps) {
    const { isFetching } = this.props;
    this.setState(prevState => ({
      initialized: prevState.initialized || (isFetching && !nextProps.isFetching),
    }));
  }

  render() {
    const {
      user, settings, children, location: { pathname }, didLostAuth,
    } = this.props;

    if (didLostAuth) {
      return (
        <Redirect push to={`/auth/signin?redirect=${pathname}`} />
      );
    }

    const appLoadProps = {
      isLoading: !this.state.initialized,
      hasFailure: this.state.initialized && (!user || !settings),
      fallbackUrl: pathname,
      children,
    };

    return (<AppLoader {...appLoadProps} />);
  }
}

export default AuthenticatedLayout;
