import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestDiscussions } from '../../../../store/modules/discussion';
import { requestNewMessages } from '../../actions/requestNewMessages';
import { newMessageIdsSelector } from '../../selectors/newMessageIdsSelector';
import { messageNotificationsSelector } from '../../selectors/messageNotificationsSelector';
import Presenter from './presenter';

const mapStateToProps = state => ({
  notifications: messageNotificationsSelector(state),
  newMessageIds: newMessageIdsSelector(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestNewMessages,
  requestDiscussions,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Presenter);
