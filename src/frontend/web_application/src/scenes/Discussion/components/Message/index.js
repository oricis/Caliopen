import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { reply } from '../../../../modules/draftMessage';
import { updateTagCollection, withTags } from '../../../../modules/tags';
import { messageEncryptionStatusSelector } from '../../../../modules/encryption';
import { isMessageEncrypted } from '../../../../services/encryption';

import Presenter from './presenter';

const onReply = ({ message }) => (dispatch) => {
  dispatch(reply({ internalId: message.discussion_id, message }));
};

const mapStateToProps = (state, { message }) => createSelector(
  [messageEncryptionStatusSelector],
  (messageEncryptionStatus) => {
    const encryptionStatus = messageEncryptionStatus[message.message_id];

    return {
      isLocked: isMessageEncrypted(message) &&
        (!encryptionStatus || (encryptionStatus && encryptionStatus.status !== 'decrypted')),
      encryptionStatus,
    };
  }
);

const mapDispatchToProps = dispatch => bindActionCreators({
  onReply,
  updateTagCollection,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTags(),
)(Presenter);
