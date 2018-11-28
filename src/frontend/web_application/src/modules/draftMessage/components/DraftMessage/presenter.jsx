import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withI18n } from '@lingui/react';
import { Trans } from '@lingui/macro'; // eslint-disable-line import/no-extraneous-dependencies
import { Button, Icon, InputText, TextareaFieldGroup, TextFieldGroup, Link, Confirm } from '../../../../components';
import { withScrollTarget } from '../../../scroll';
import RecipientList from '../RecipientList';
import AttachmentManager from '../AttachmentManager';
import IdentitySelector from '../IdentitySelector';
import { getRecipients } from '../../../../services/message/';
import { withIdentities } from '../../../identity';
import { withNotification } from '../../../userNotify';

import './draft-message-quick.scss';
import './draft-message-advanced.scss';
import './toggle-advanced-draft-button.scss';

@withI18n()
@withNotification()
@withIdentities()
@withScrollTarget()
class DraftMessage extends Component {
  static propTypes = {
    className: PropTypes.string,
    isReply: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
    identities: PropTypes.arrayOf(PropTypes.shape({})),
    scrollTarget: PropTypes.shape({ forwardRef: PropTypes.func }).isRequired,
    internalId: PropTypes.string.isRequired,
    draftMessage: PropTypes.shape({
      user_identities: PropTypes.arrayOf(PropTypes.string),
    }),
    original: PropTypes.shape({}),
    onEditDraft: PropTypes.func.isRequired,
    // onSaveDraft: PropTypes.func.isRequired,
    onSendDraft: PropTypes.func.isRequired,
    canEditRecipients: PropTypes.bool,
    parentMessage: PropTypes.shape({}),
    // useful for invalidate discussion collection messages
    onSent: PropTypes.func,
    onDeleteMessage: PropTypes.func.isRequired,
    onUploadAttachments: PropTypes.func.isRequired,
    onDeleteAttachement: PropTypes.func.isRequired,
    draftFormRef: PropTypes.func,
    onFocus: PropTypes.func,
  };
  static defaultProps = {
    className: undefined,
    identities: [],
    isReply: false,
    draftMessage: undefined,
    original: undefined,
    canEditRecipients: false,
    parentMessage: undefined,
    draftFormRef: () => {},
    onFocus: () => {},
    onSent: () => {},
  };

  static genererateStateFromProps(props, prevState) {
    const { draftMessage, isReply } = props;

    if (!draftMessage) {
      return prevState;
    }

    const recipients = getRecipients(draftMessage);

    return {
      advancedForm: !isReply,
      draftMessage: {
        ...prevState.draftMessage,
        body: draftMessage.body,
        subject: draftMessage.subject,
        identityId: draftMessage.user_identities[0],
        recipients,
      },
    };
  }

  static getDraftFromState(state, props) {
    // const identity = props.identities
    //   .find(ident => ident.identity_id === state.draftMessage.identityId);

    return {
      ...props.draftMessage,
      body: state.draftMessage.body,
      subject: state.draftMessage.subject,
      user_identities: [state.draftMessage.identityId],
      participants: state.draftMessage.recipients,
      // FIXME: cf. #1111
      // protocol: identity && identity.protocol,
    };
  }

  static initialState = {
    advancedForm: true,
    draftMessage: {
      body: '',
      identityId: '',
      subject: '',
      recipients: [],
    },
  };

  state = this.constructor.genererateStateFromProps(this.props, this.constructor.initialState);

  componentDidUpdate(prevProps) {
    if (!prevProps.draftMessage && !!this.props.draftMessage) {
      // dangerous if latency made the user already start to fill the draft
      // TODO: refactor with placeholder blocks
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(prevState => this.constructor.genererateStateFromProps(this.props, prevState));
    }
  }

  getRecipientList = () => {
    const { draftMessage } = this.props;

    // participants may not be present when the draft is new, it is the responsibility of the
    // backend to calculate what will be the participants for a reply
    if (!draftMessage || !draftMessage.participants) {
      return null;
    }

    const recipients = getRecipients(draftMessage);

    if (recipients.length > 3) {
      return recipients.map(recipient => recipient.identifier).join(', ').concat('...');
    }

    return recipients.map(recipient => recipient.identifier).join(', ');
  }

  getQuickInputPlaceholder = () => {
    const { i18n, draftMessage, identities } = this.props;

    const [identityId] = draftMessage.user_identities;
    const { identifier } = identities.find(identity => identity.identity_id === identityId);

    const recipientsList = this.getRecipientList();

    if (draftMessage && draftMessage.discussion_id && recipientsList) {
      return i18n._('draft-message.form.placeholder.quick-reply', { recipients: recipientsList, protocol: identifier }, { defaults: 'Quick reply to {recipients} from {protocol}' });
    }

    if (draftMessage && draftMessage.discussion_id) {
      return i18n._('draft-message.form.placeholder.quick-reply-no-recipients', { identifier }, { defaults: 'Quick reply from {identifier}' });
    }

    return i18n._('draft-message.form.placeholder.quick-start', null, { defaults: 'Start a new discussion' });
  }

  handleToggleAdvancedForm = () => {
    this.setState(prevState => ({
      advancedForm: !prevState.advancedForm,
    }));
  }

  handleChange = (ev) => {
    const { name, value } = ev.target;

    this.setState((prevState) => {
      const draftMessage = {
        ...prevState.draftMessage,
        [name]: value,
      };

      return {
        draftMessage,
        hasChanged: true,
      };
    }, () => {
      const { internalId, original, onEditDraft } = this.props;

      return onEditDraft({
        internalId,
        draft: this.constructor.getDraftFromState(this.state, this.props),
        message: original,
      });
    });
  }

  // @deprecated: saving button has been removed
  // handleSave = async ({ draft }) => {
  //   const {
  //     internalId, message, notifySuccess, notifyError, i18n, onSaveDraft,
  //   } = this.props;
  //
  //   try {
  //     await onSaveDraft({ draft, message, internalId });
  //
  //     return notifySuccess({ message: i18n._('draft.feedback.saved', null, { defaults: 'Draft
  //     saved' }) });
  //   } catch (err) {
  //     return notifyError({
  //       message: i18n._('draft.feedback.save-error', null, { defaults: 'Unable to save the draft'
  //       }),
  //     });
  //   }
  // }

  handleSend = async () => {
    const {
      onSendDraft, internalId, original, draftMessage, notifyError, i18n, onSent,
    } = this.props;

    this.setState({ isSending: true });

    try {
      await onSendDraft({
        draft: this.constructor.getDraftFromState(this.state, this.props),
        message: original,
        internalId,
      });

      onSent({ message: draftMessage });
    } catch (err) {
      notifyError({
        message: i18n._('draft.feedback.send-error', null, { defaults: 'Unable to send the message' }),
      });
    }
    this.setState({ isSending: false });
  }

  handleDelete = () => {
    const {
      original, internalId, onDeleteMessage,
    } = this.props;

    onDeleteMessage({ message: original, internalId });
  }

  // @deprecated: edit tags button has been removed
  // handleTagsChange = async ({ tags }) => {
  //   const {
  //     onUpdateEntityTags, i18n, message, draft, discussionId,
  //   } = this.props;
  //
  //   return onUpdateEntityTags(discussionId, i18n, message, { type: 'message', entity: draft, tags
  //   });
  // }

  handleFilesChange = async ({ attachments }) => {
    const {
      onUploadAttachments, i18n, original, internalId,
    } = this.props;

    return onUploadAttachments(internalId, i18n, original, {
      draft: this.constructor.getDraftFromState(this.state, this.props),
      attachments,
    });
  }

  handleDeleteAttachement = (attachment) => {
    const {
      onDeleteAttachement, i18n, original, internalId,
    } = this.props;

    return onDeleteAttachement(internalId, i18n, original, {
      draft: this.constructor.getDraftFromState(this.state, this.props),
      attachment,
    });
  }

  handleIdentityChange = ({ identity = {} }) => {
    this.setState(prevState => ({
      draftMessage: {
        ...prevState.draftMessage,
        identityId: identity.identity_id,
      },
    }), () => {
      const { internalId, original, onEditDraft } = this.props;

      return onEditDraft({
        internalId,
        draft: this.constructor.getDraftFromState(this.state, this.props),
        message: original,
      });
    });
  }

  handleRecipientsChange = (recipients) => {
    this.setState(prevState => ({
      draftMessage: {
        ...prevState.draftMessage,
        // no need to merge author, backend does it
        recipients,
      },
      hasChanged: true,
    }), () => {
      const { internalId, original, onEditDraft } = this.props;

      return onEditDraft({
        internalId,
        draft: this.constructor.getDraftFromState(this.state, this.props),
        message: original,
      });
    });
  }

  renderToggleAdvancedButton() {
    const { i18n } = this.props;
    const caretType = this.state.advancedForm ? 'caret-up' : 'caret-down';

    return (
      <Button
        display="expanded"
        shape="plain"
        className="m-toggle-advanced-draft-button"
        title={i18n._('draft-message.action.toggle-advanced', null, { defaults: 'Toggle advanced or quick message form' })}
        onClick={this.handleToggleAdvancedForm}
      >
        <Icon type="envelope" />
        <Icon type={caretType} />
      </Button>
    );
  }

  renderRecipientList({ className } = {}) {
    const { canEditRecipients } = this.props;

    if (canEditRecipients) {
      const { internalId, identities } = this.props;
      const identity = identities
        .find(ident => ident.identity_id === this.state.draftMessage.identityId);

      return (
        <RecipientList
          className={className}
          internalId={internalId}
          recipients={this.state.draftMessage.recipients}
          onRecipientsChange={this.handleRecipientsChange}
          identity={identity}
        />
      );
    }

    return null;
  }

  renderQuick() {
    const {
      className, i18n, draftFormRef, onFocus, scrollTarget: { forwardRef },
    } = this.props;
    const ref = (el) => {
      draftFormRef(el);
      forwardRef(el);
    };

    return (
      <div className={classnames(className, 'm-draft-message-quick')} ref={ref}>
        <div className={classnames(className, 'm-draft-message-quick__container')}>
          <div className="m-draft-message-quick__toggle-advanced">
            {this.renderToggleAdvancedButton()}
          </div>
          <InputText
            className="m-draft-message-quick__input"
            onChange={this.handleChange}
            onFocus={onFocus}
            name="body"
            value={this.state.draftMessage.body}
            placeholder={this.getQuickInputPlaceholder()}
          />
          <div className="m-draft-message-quick__send">
            <Button
              display="expanded"
              shape="plain"
              icon="paper-plane"
              title={i18n._('draft-message.action.send', null, { defaults: 'Send' })}
              className="m-draft-message-quick__send-button"
              onClick={this.handleSend}
            />
          </div>
        </div>
      </div>
    );
  }

  renderAdvanced() {
    const {
      className, draftMessage, parentMessage, original, draftFormRef, isReply, identities, onFocus,
      scrollTarget: { forwardRef },
    } = this.props;

    const isSubjectSupported = ({ draft }) => {
      if (!draft.identityId) {
        return false;
      }

      const currIdentity = identities.find(ident => ident.identity_id === draft.identityId);

      if (!currIdentity) {
        return false;
      }

      return currIdentity.protocol === 'email';
    };

    const hasSubject = isSubjectSupported({ draft: this.state.draftMessage });
    const ref = (el) => {
      draftFormRef(el);
      forwardRef(el);
    };

    return (
      <div className={classnames(className, 'm-draft-message-advanced')} ref={ref} >
        <div className="m-draft-message-advanced__toggle-simple">
          {isReply && this.renderToggleAdvancedButton()}
        </div>
        <div className="m-draft-message-advanced__container">
          <IdentitySelector
            className="m-draft-message-advanced__identity"
            identities={identities}
            identityId={this.state.draftMessage.identityId}
            onChange={this.handleIdentityChange}
          />
          {this.renderRecipientList({ className: 'm-draft-message-advanced__recipient-list' })}
          {parentMessage && (
            <div className="m-reply__parent">
              <Link to={`#${parentMessage.message_id}`} className="m-reply__parent-link">
                <Trans id="reply-form.in-reply-to">In reply to: {parentMessage.excerpt}</Trans>
              </Link>
            </div>
          )}
          {!isReply && hasSubject && (
            <TextFieldGroup
              className="m-draft-message-advanced__subject"
              display="inline"
              label={<Trans id="messages.compose.form.subject.label">Subject</Trans>}
              name="subject"
              value={this.state.draftMessage.subject}
              onChange={this.handleChange}
            />
          )}
          <TextareaFieldGroup
            className="m-draft-advanced__body"
            label={<Trans id="messages.compose.form.body.label">Type your message here...</Trans>}
            showLabelForSR
            inputProps={{
              name: 'body',
              onChange: this.handleChange,
              onFocus,
              value: this.state.draftMessage.body,
            }}
          />
          <AttachmentManager
            className="m-draft-message-advanced__attachments"
            onUploadAttachments={this.handleFilesChange}
            onDeleteAttachement={this.handleDeleteAttachement}
            message={draftMessage}
          />
        </div>
        <div className="m-draft-message-advanced__action-send">
          <Confirm
            onConfirm={this.handleDelete}
            title={(<Trans id="message-list.message.confirm-delete.title">Delete a message</Trans>)}
            content={(<Trans id="message-list.message.confirm-delete.content">The deletion is permanent, are you sure you want to delete this message ?</Trans>)}
            render={confirm => (
              <Button
                onClick={confirm}
                icon="trash"
                disabled={!original}
                color="alert"
                className="m-draft-message-advanced__action-button"
              >
                <Trans id="message-list.message.action.delete">Delete</Trans>
              </Button>
            )}
          />
          <Button
            shape="plain"
            className="m-draft-message-advanced__action-button m-draft-message-advanced__button-send"
            onClick={this.handleSend}
          >
            <Icon type="laptop" /> --- <Icon type="user" /> <Trans id="draft-message.action.send">Send</Trans>
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return this.state.advancedForm ? this.renderAdvanced() : this.renderQuick();
  }
}

export default DraftMessage;
