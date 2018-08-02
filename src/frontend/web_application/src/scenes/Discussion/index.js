import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { UserSelector } from '../../store/selectors/user';
import withScrollManager from '../../modules/scroll/hoc/scrollManager';
import Discussion from './presenter';

const getDiscussionIdFromProps = props => props.match.params.discussionId;
const discussionIdSelector = (state, ownProps) => getDiscussionIdFromProps(ownProps);


const mapStateToProps = createSelector(
  [discussionIdSelector, UserSelector],
  (discussionId, userState) => ({ discussionId, user: userState.user })
);

export default compose(withScrollManager(), connect(mapStateToProps))(Discussion);
