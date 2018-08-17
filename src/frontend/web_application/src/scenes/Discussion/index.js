import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { UserSelector } from '../../store/selectors/user';
import { withCurrentTab, withCloseTab } from '../../modules/tab';
import withScrollManager from '../../modules/scroll/hoc/scrollManager';
import Discussion from './presenter';

const discussionIdSelector = (state, ownProps) => ownProps.match.params.discussionId;
const discussionSelector = state => state.discussion;

const mapStateToProps = createSelector(
  [discussionSelector, discussionIdSelector, UserSelector],
  (discussionState, discussionId, userState) => (
    {
      discussionId,
      user: userState.user,
      discussion: discussionState.discussionsById[discussionId],
    }
  )
);

export default compose(
  connect(mapStateToProps),
  withScrollManager(),
  withCloseTab(),
  withCurrentTab(),
)(Discussion);
