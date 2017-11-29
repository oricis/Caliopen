import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { UserSelector } from '../store/selectors/user';

const mapStateToProps = createSelector(
  [UserSelector],
  userState => ({
    user: userState.user,
    isFetching: userState.isFetching,
  })
);

const withUser = () => Component => connect(mapStateToProps)(Component);

export { withUser };
