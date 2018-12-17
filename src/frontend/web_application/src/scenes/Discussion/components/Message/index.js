import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { reply } from '../../../../modules/draftMessage';
import { updateTagCollection, withTags } from '../../../../modules/tags';

import Presenter from './presenter';

const onReply = ({ message }) => (dispatch) => {
  dispatch(reply({ internalId: message.discussion_id, message }));
};

const mapDispatchToProps = dispatch => bindActionCreators({
  onReply,
  updateTagCollection,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTags(),
)(Presenter);
