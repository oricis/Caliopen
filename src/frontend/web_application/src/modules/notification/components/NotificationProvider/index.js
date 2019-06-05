import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateAll } from '../../../../store/modules/notification';
import Presenter from './presenter';

const mapStateToProps = state => ({
  notifications: state.notification.notifications,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateNotifications: updateAll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Presenter);
