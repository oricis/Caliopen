import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
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
  connect(null, mapDispatchToProps),
)(Presenter);
