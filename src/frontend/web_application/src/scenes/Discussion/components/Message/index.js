import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { updateTagCollection, withTags } from '../../../../modules/tags';

import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTagCollection,
}, dispatch);

export default compose(connect(null, mapDispatchToProps), withTags())(Presenter);
