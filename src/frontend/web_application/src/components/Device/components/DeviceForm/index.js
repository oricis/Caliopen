import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { updateDevice } from '../../../../store/modules/device';
import Presenter from './presenter';


const mapDispatchToProps = dispatch => bindActionCreators({
  onChange: updateDevice,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTranslator()
)(Presenter);
