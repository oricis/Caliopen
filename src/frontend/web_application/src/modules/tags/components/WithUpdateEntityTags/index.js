import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { updateTagCollection } from '../../actions/updateTagCollection';

import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTagCollection,
}, dispatch);

export default compose(
  withI18n(),
  connect(null, mapDispatchToProps),
)(Presenter);
