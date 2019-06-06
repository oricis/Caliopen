import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withI18n } from '@lingui/react';
import { Button, Spinner } from '../../../../components';
import { LockedMessage } from '../../../../modules/encryption';
import ToggleAdvancedFormButton from '../ToggleAdvancedFormButton';
import { getRecipients } from '../../../../services/message';

export const KEY = {
  ENTER: 13,
};

@withI18n()
class QuickDraftForm extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    encryptionChildren: PropTypes.node,
    className: PropTypes.string,
    innerRef: PropTypes.shape({}),
    handleSend: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    draftEncryption: PropTypes.bool.isRequired,
    encryptionEnabled: PropTypes.bool.isRequired,
    isLocked: PropTypes.bool.isRequired,
    body: PropTypes.string.isRequired,
    canSend: PropTypes.bool.isRequired,
    isSending: PropTypes.bool.isRequired,
    draftMessage: PropTypes.shape({}),
    availableIdentities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    advancedForm: PropTypes.bool,
    handleToggleAdvancedForm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    encryptionChildren: null,
    className: undefined,
    innerRef: undefined,
    draftMessage: undefined,
    advancedForm: false,
  };

  state = {};

  getRecipientList = () => {
    const { draftMessage } = this.props;

    // participants may not be present when the draft is new, it is the responsibility of the
    // backend to calculate what will be the participants for a reply
    if (!draftMessage || !draftMessage.participants) {
      return null;
    }

    const recipients = getRecipients(draftMessage);

    if (!recipients) {
      return '';
    }

    if (recipients.length > 3) {
      return recipients.map(recipient => recipient.address).join(', ').concat('...');
    }

    return recipients.map(recipient => recipient.address).join(', ');
  }

  getQuickInputPlaceholder = () => {
    const { i18n, draftMessage, availableIdentities } = this.props;

    const [identityId] = draftMessage && draftMessage.user_identities ?
      draftMessage.user_identities : [];
    const { identifier } = availableIdentities
      .find(identity => identity.identity_id === identityId) || {};

    const recipientsList = this.getRecipientList();

    if (draftMessage && draftMessage.discussion_id && recipientsList && identifier) {
      return i18n._('draft-message.form.placeholder.quick-reply', { recipients: recipientsList, protocol: identifier }, { defaults: 'Quick reply to {recipients} from {protocol}' });
    }

    if (draftMessage && draftMessage.discussion_id && identifier) {
      return i18n._('draft-message.form.placeholder.quick-reply-no-recipients', { identifier }, { defaults: 'Quick reply from {identifier}' });
    }

    return i18n._('draft-message.form.placeholder.quick-start', null, { defaults: 'Start a new discussion' });
  }

  handlePressSendShortKey = (ev) => {
    const { which: keyCode, ctrlKey } = ev;
    if (keyCode === KEY.ENTER && ctrlKey) {
      ev.preventDefault();
      this.props.handleSend(ev);
    }
  }

  render() {
    const {
      i18n, innerRef, className, handleSend, handleChange, onFocus, draftEncryption,
      encryptionEnabled, isLocked, body, canSend, encryptionChildren, isSending, advancedForm,
      handleToggleAdvancedForm,
    } = this.props;

    return (
      <div className={classnames(className, 'm-draft-message-quick')} ref={innerRef}>
        <form onSubmit={handleSend}>
          <div className={classnames(className, 'm-draft-message-quick__container')}>
            <div className="m-draft-message-quick__toggle-advanced">
              <ToggleAdvancedFormButton
                advancedForm={advancedForm}
                handleToggleAdvancedForm={handleToggleAdvancedForm}
              />
            </div>
            {
              isLocked ? (
                <LockedMessage encryptionStatus={draftEncryption} />
              ) : (
                <textarea
                  rows={/\n+/.test(body) ? 7 : 1}
                  className={classnames(
                    'm-draft-message-quick__input',
                    { 'm-draft-message-quick__input--encrypted': encryptionEnabled }
                  )}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onKeyPress={this.handlePressSendShortKey}
                  name="body"
                  value={body}
                  placeholder={this.getQuickInputPlaceholder()}
                />
              )
            }
            <div className={classnames(
              'm-draft-message-quick__send',
              {
                'm-draft-message-quick__send--encrypted': encryptionEnabled,
                'm-draft-message-quick__send--unencrypted': !encryptionEnabled,
              }
            )}
            >
              <Button
                type="submit"
                display="expanded"
                shape="plain"
                icon={isSending ? (<Spinner loading display="block" />) : 'paper-plane'}
                title={i18n._('draft-message.action.send', null, { defaults: 'Send' })}
                className={classnames(
                  'm-draft-message-quick__send-button',
                  {
                    'm-draft-message-quick__send-button--encrypted': encryptionEnabled,
                    'm-draft-message-quick__send-button--unencrypted': !encryptionEnabled,
                  }
                )}
                disabled={!canSend}
              />
            </div>
          </div>
          <div className="m-draft-message-quick__encryption">
            {encryptionChildren}
          </div>
        </form>
      </div>
    );
  }
}

export default forwardRef((props, ref) => (<QuickDraftForm {...props} innerRef={ref} />));
