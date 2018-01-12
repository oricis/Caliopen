import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { requestTags } from '../../actions/requestTags';
import { createTag } from '../../actions/createTag';
import { updateTagCollection } from '../../actions/updateTagCollection';

import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  requestTags,
  createTag,
  updateTagCollection,
}, dispatch);

export default compose(
  withI18n(),
  connect(null, mapDispatchToProps),
)(Presenter);
