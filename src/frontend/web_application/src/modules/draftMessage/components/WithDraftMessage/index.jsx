import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Presenter from './presenter';
import { requestDraft } from '../../actions/requestDraft';
import { withCurrentInternalId } from '../../hoc/withCurrentInternalId';
import { messagesByIdSelector } from '../../../../store/selectors/message';

const internalIdSelector = (state, ownProps) => ownProps.internalId;
const draftStateSelector = state => state.draftMessage;
const draftActivitySelector = createSelector(
  [draftStateSelector, internalIdSelector],
  (draftState, internalId) => draftState.draftActivityByInternalId[internalId] || {}
);
const draftMessageSelector = createSelector(
  [draftStateSelector, internalIdSelector],
  (draftState, internalId) => draftState.draftsByInternalId[internalId]
);
const messageSelector = createSelector(
  [messagesByIdSelector, draftMessageSelector],
  (messagesById, draftMessage) => draftMessage && messagesById[draftMessage.message_id]
);

const mapStateToProps = createSelector(
  [
    internalIdSelector, draftActivitySelector, draftMessageSelector, messageSelector,
  ],
  (internalId, draftActivity, draftMessage, message) => {
    const { isRequestingDraft, isDeletingDraft } = draftActivity;

    return {
      internalId,
      draftMessage,
      isRequestingDraft,
      isDeletingDraft,
      original: message,
    };
  }
);

const mapDispatchToProps = dispatch => bindActionCreators({
  requestDraft,
}, dispatch);

export default compose(
  withCurrentInternalId(),
  connect(mapStateToProps, mapDispatchToProps)
)(Presenter);
