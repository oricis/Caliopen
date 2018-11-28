import { Component } from 'react';
import PropTypes from 'prop-types';

class WithIdentities extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    remoteIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    remoteIsFetching: PropTypes.bool,
    getRemoteIdentities: PropTypes.func.isRequired,
    localIdentities: PropTypes.arrayOf(PropTypes.shape({})),
    localIsFetching: PropTypes.bool,
    getLocalIdentities: PropTypes.func.isRequired,
  };
  static defaultProps = {
    remoteIdentities: undefined,
    localIdentities: undefined,
    remoteIsFetching: false,
    localIsFetching: false,
  };

  componentDidMount() {
    const {
      remoteIsFetching, getRemoteIdentities,
      localIsFetching, getLocalIdentities,
    } = this.props;

    if (!remoteIsFetching) {
      getRemoteIdentities();
    }

    if (!localIsFetching) {
      getLocalIdentities();
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
