import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { NewDraftForm, DraftMessageActionsContainer, AttachmentManager } from '../../modules/draftMessage';
import { withPush, withReplace } from '../../modules/routing';

@withPush()
@withReplace()
class NewDraft extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    draft: PropTypes.shape({}),
    message: PropTypes.shape({}),
    internalId: PropTypes.string,
    currentTab: PropTypes.shape({}).isRequired,
    closeTab: PropTypes.func.isRequired,
    onEditDraft: PropTypes.func.isRequired,
    onSaveDraft: PropTypes.func.isRequired,
    onDeleteMessage: PropTypes.func.isRequired,
    onSendDraft: PropTypes.func.isRequired,
    onUpdateEntityTags: PropTypes.func.isRequired,
    notifySuccess: PropTypes.func.isRequired,
    notifyError: PropTypes.func.isRequired,
    onUploadAttachments: PropTypes.func.isRequired,
    onDeleteAttachement: PropTypes.func.isRequired,
    requestDraft: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  };

  static defaultProps = {
    draft: undefined,
    message: undefined,
    internalId: undefined,
  };

  state = {
    isSending: false,
    isRequestingDraft: false,
  };

  componentDidMount() {
    return this.initDraft(this.props);
  }

  componentWillReceiveProps(nextProps) {
    return this.initDraft(nextProps);
  }

  initDraft = async (props) => {
    if (this.state.isRequestingDraft) {
      return undefined;
    }

    const {
      internalId,
      draft,
      requestDraft,
      replace,
    } = props;

    if (!internalId) {
      const newPathname = `/compose/${uuidv4()}`;

      return replace(newPathname);
    }

    if (!draft) {
      this.setState({ isRequestingDraft: true });
      await requestDraft({ internalId });
      this.setState({ isRequestingDraft: false });
    }

    return undefined;
  }

  handleEditDraft = ({ draft }) => {
    const { internalId, message, onEditDraft } = this.props;

    return onEditDraft({ internalId, draft, message });
  };

  handleTagsChange = ({ tags }) => {
    const {
      internalId, draft, onUpdateEntityTags, i18n, message,
    } = this.props;

    return onUpdateEntityTags(internalId, i18n, message, { type: 'message', entity: draft, tags });
  }

  handleSaveDraft = async ({ draft }) => {
    const {
      i18n, onSaveDraft, notifySuccess, notifyError, internalId, message,
    } = this.props;

    try {
      await onSaveDraft({ internalId, draft, message });

      return notifySuccess({ message: i18n._('draft.feedback.saved', { defaults: 'Draft saved' }) });
    } catch (err) {
      return notifyError({
        message: i18n._('draft.feedback.save-error', { defaults: 'Unable to save the draft' }),
      });
    }
  }

  handleSend = async ({ draft }) => {
    const {
      onSendDraft, internalId, message, closeTab, notifyError, i18n, currentTab, push,
    } = this.props;
    this.setState({ isSending: true });

    try {
      const messageUpToDate = await onSendDraft({ draft, message, internalId });
      push(`/discussions/${messageUpToDate.discussion_id}`);
      closeTab(currentTab);
    } catch (err) {
      notifyError({
        message: i18n._('draft.feedback.send-error', { defaults: 'Unable to send the message' }),
      });
    }
    this.setState({ isSending: false });
  }

  handleDelete = async () => {
    const { message, onDeleteMessage, closeTab } = this.props;
    await onDeleteMessage({ message });
    closeTab();
  };

  handleFilesChange = ({ attachments }) => {
    const {
      onUploadAttachments, i18n, message, draft, internalId,
    } = this.props;

    return onUploadAttachments(internalId, i18n, message, { draft, attachments });
  }

  handleDeleteAttachement = (attachment) => {
    const {
      onDeleteAttachement, i18n, message, draft, internalId,
    } = this.props;

    return onDeleteAttachement(internalId, i18n, message, { draft, attachment });
  }

  renderDraftMessageActionsContainer = () => {
    const { draft, internalId } = this.props;

    return (
      <DraftMessageActionsContainer
        message={draft}
        internalId={internalId}
        onDelete={this.handleDelete}
        onTagsChange={this.handleTagsChange}
      />
    );
  }

  renderAttachments = () => {
    const { draft } = this.props;

    const props = {
      message: draft,
      onUploadAttachments: this.handleFilesChange,
      onDeleteAttachement: this.handleDeleteAttachement,
    };

    return (
      <AttachmentManager {...props} />
    );
  }

  render() {
    const { draft, internalId } = this.props;

    return (
      <NewDraftForm
        internalId={internalId}
        draft={draft}
        onChange={this.handleEditDraft}
        onSave={this.handleSaveDraft}
        onSend={this.handleSend}
        isSending={this.state.isSending}
        renderDraftMessageActionsContainer={this.renderDraftMessageActionsContainer}
        renderAttachments={this.renderAttachments}
      />
    );
  }
}

export default NewDraft;
