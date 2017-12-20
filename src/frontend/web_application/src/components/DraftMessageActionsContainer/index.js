import { connect } from 'react-redux';
import { compose } from 'redux';
import { withI18n } from 'lingui-react';
import { withNotification } from '../../hoc/notification';
import Presenter from './presenter';

const mapDispatchToProps = (dispatch, ownProps) => ({
  onEditTags: () => ownProps.notify({ message: 'Not yet implemented' }),
});

export default compose(
  withNotification(),
  withI18n(),
  connect(null, mapDispatchToProps),
)(Presenter);
