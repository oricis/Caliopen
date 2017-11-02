import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { push } from 'react-router-redux';
import { editDraft, requestNewDraft, saveDraft, sendDraft, clearDraft } from '../../store/modules/draft-message';
import { withNotification } from '../../hoc/notification';
import { deleteMessage } from '../../store/modules/message';
import Presenter from './presenter';

const messageDraftSelector = state => state.draftMessage.draftsByInternalId;
const messageSelector = state => state.message.messagesById;
const internalIdSelector = (state, ownProps) => ownProps.match.params.internalId;
const draftSelector = createSelector(
  [messageDraftSelector, internalIdSelector],
  (draftsByInternalId, internalId) => draftsByInternalId[internalId],
);

const mapStateToProps = createSelector(
  [draftSelector, messageSelector, internalIdSelector],
  (draft, messagesById, internalId) => ({
    draft,
    message: draft && messagesById[draft.message_id],
    internalId,
  })
);

const onSaveDraft = ({ internalId, draft, message }, ownProps) => dispatch =>
  dispatch(saveDraft({ internalId, draft, message }))
    .then(() => {
      const { __, notifySuccess } = ownProps;

      return notifySuccess({ message: __('draft.feedback.saved') });
    });

const onDeleteMessage = ({ message, internalId }) => dispatch =>
  dispatch(deleteMessage({ message }))
    .then(() => dispatch(clearDraft({ internalId })))
    .then(() => dispatch(push('/')));

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  requestNewDraft,
  editDraft,
  sendDraft,
  onSaveDraft: params => onSaveDraft(params, ownProps),
  onDeleteMessage,
}, dispatch);

export default compose(
  withTranslator(),
  withNotification(),
  connect(mapStateToProps, mapDispatchToProps)
)(Presenter);
