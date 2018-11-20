import { Component } from 'react';
import PropTypes from 'prop-types';

class WithIdentities extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    remoteIsFetching: PropTypes.bool,
    remotedidInvalidated: PropTypes.bool,
    requestRemoteIdentities: PropTypes.func.isRequired,
    localIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    localIsFetching: PropTypes.bool,
    localdidInvalidated: PropTypes.bool,
    requestLocalIdentities: PropTypes.func.isRequired,
  };
  static defaultProps = {
    remoteIdentities: undefined,
    localIdentities: undefined,
    remoteIsFetching: false,
    localIsFetching: false,
    remotedidInvalidated: false,
    localdidInvalidated: false,
  };

  componentDidMount() {
    const {
      remoteIdentities, remoteIsFetching, remotedidInvalidated, requestRemoteIdentities,
      localIdentities, localIsFetching, localdidInvalidated, requestLocalIdentities,
    } = this.props;

    if ((remoteIdentities.length === 0 || remotedidInvalidated) && !remoteIsFetching) {
      requestRemoteIdentities();
    }

    if ((localIdentities.length === 0 || localdidInvalidated) && !localIsFetching) {
      requestLocalIdentities();
    }
  }

  render() {
    const {
      render, remoteIdentities, remoteIsFetching, localIdentities, localIsFetching,
    } = this.props;

    const isFetching = (remoteIsFetching || localIsFetching);
    const identities = [...localIdentities, ...remoteIdentities];

    return render({ identities, isFetching });
  }
}

export default WithIdentities;
