import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppLoader } from '../../../../components';
import { withAuthenticatedProps } from './withAuthenticatedProps';

@withAuthenticatedProps()
class AuthenticatedLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({}),
    settings: PropTypes.shape({}),
    isFetching: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    user: undefined,
    settings: undefined,
  };
  state = {};

  render() {
    const {
      isFetching, user, settings, children,
    } = this.props;

    const appLoadProps = {
      isLoading: isFetching,
      hasFailure: !isFetching && (!user || !settings),
      children,
    };

    return (<AppLoader {...appLoadProps} />);
  }
}

export default AuthenticatedLayout;
