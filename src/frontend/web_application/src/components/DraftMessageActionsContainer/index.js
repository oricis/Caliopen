import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslator } from '@gandi/react-translate';
import { withNotification } from '../../hoc/notification';
import Presenter from './presenter';

const mapDispatchToProps = (dispatch, ownProps) => ({
  onEditTags: () => ownProps.notify({ message: 'Not yet implemented' }),
});

export default compose(
  withNotification(),
  withTranslator(),
  connect(null, mapDispatchToProps),
)(Presenter);
