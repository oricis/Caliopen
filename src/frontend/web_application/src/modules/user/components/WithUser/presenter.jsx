import { Component } from 'react';
import PropTypes from 'prop-types';
import { isAuthenticated } from '../../../user';

class WithUser extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    user: PropTypes.shape({}),
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    synced: PropTypes.bool,
  };

  static defaultProps = {
    user: undefined,
    didInvalidate: false,
    isFetching: true,
    synced: false,
  };

  componentDidMount() {
    const {
      user, getUser, didInvalidate, isFetching,
    } = this.props;

    if ((!user || didInvalidate) && !isFetching && isAuthenticated()) {
      getUser();
    }
  }

  render() {
    const {
      render, user, isFetching, synced,
    } = this.props;

    if (synced && !user) {
      return null;
    }

    return render(user, isFetching);
  }
}

export default WithUser;
