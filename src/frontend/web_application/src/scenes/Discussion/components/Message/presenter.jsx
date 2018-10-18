import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from '@lingui/react';
import { ManageEntityTags } from '../../../../modules/tags';
import { Modal } from '../../../../components';
import InstantMessage from '../InstantMessage';
import MailMessage from '../MailMessage';

@withI18n()
class Message extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    onMessageRead: PropTypes.func.isRequired,
    onMessageUnread: PropTypes.func.isRequired,
    onMessageDelete: PropTypes.func,
    onReply: PropTypes.func.isRequired,
    scrollToMe: PropTypes.func,
    user: PropTypes.shape({}).isRequired,
    updateTagCollection: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    scrollToMe: undefined,
    onMessageDelete: undefined,
  };

  state = {
    isTagModalOpen: false,
  };

  isMail = () => {
    const { message } = this.props;

    return message.type === 'email';
  };

  handleTagsChange = async ({ tags }) => {
    const { updateTagCollection, i18n, message: entity } = this.props;

    return updateTagCollection(i18n, { type: 'message', entity, tags });
  };

  handleOpenTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: true,
    }));
  };

  handleCloseTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: false,
    }));
  };

  handleDeleteMessage = () => {
    const { onMessageDelete, message } = this.props;
    if (onMessageDelete) {
      onMessageDelete({ message });
    }
  }

  renderTagsModal = () => {
    const { message, i18n } = this.props;
    const nb = message.tags ? message.tags.length : 0;
    const title = (
      <Trans
        id="tags.header.title"
        defaults={'Tags <0>(Total: {nb})</0>'}
        values={{ nb }}
        components={[
          (<span className="m-tags-form__count" />),
        ]}
      />
    );

    return (
      <Modal
        isOpen={this.state.isTagModalOpen}
        contentLabel={i18n._('tags.header.label', null, { defaults: 'Tags' })}
        title={title}
        onClose={this.handleCloseTags}
      >
        <ManageEntityTags type="message" entity={message} onChange={this.handleTagsChange} />
      </Modal>
    );
  }


  render() {
    const commonProps = {
      onTagsChange: this.handleTagsChange,
      onOpenTags: this.handleOpenTags,
      onCloseTags: this.handleCloseTags,
      onDeleteMessage: this.handleDeleteMessage,
      ...this.props,
    };

    return (
      <Fragment>
        {
          this.isMail() ?
            <MailMessage {...commonProps} />
            :
            <InstantMessage {...commonProps} />
        }
        {this.renderTagsModal()}
      </Fragment>
    );
  }
}

export default Message;
