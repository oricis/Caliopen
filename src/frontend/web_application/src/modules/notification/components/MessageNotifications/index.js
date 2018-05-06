import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { messageNotificationsSelector } from '../../../../store/selectors/notification';
import { invalidateAll } from '../../../../store/modules/message';
import { remove } from '../../../../store/modules/notification';
import Presenter from './presenter';

const mapStateToProps = state => ({
  notifications: messageNotificationsSelector(state),
});

const removeNotifications = notifications => (dispatch) => {
  dispatch(remove(notifications));
  dispatch(invalidateAll());
};

const mapDispatchToProps = dispatch => bindActionCreators({
  removeNotifications,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
