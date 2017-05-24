import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { editSimpleDraft, requestSimpleDraft, saveDraft, sendDraft } from '../../store/modules/draft-message';
import Presenter from './presenter';

const messageDraftSelector = state => state.draftMessage.simpleDraft;

const mapStateToProps = createSelector(
  [messageDraftSelector],
  draft => ({ draft })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestSimpleDraft,
  editSimpleDraft,
  saveDraft,
  sendDraft,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslator()
)(Presenter);
