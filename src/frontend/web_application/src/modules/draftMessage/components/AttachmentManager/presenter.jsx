import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Link, FileSize, TextBlock, Button, Modal, InputFileGroup, Spinner, Icon } from '../../../../components';
import { getMaxSize } from '../../../../services/config';
import './style.scss';

function generateStateFromProps(props) {
  const { message } = props;

  if (message && message.attachments) {
    return { attachments: message.attachments };
  }

  return {};
}

class AttachmentManager extends Component {
  static propTypes = {
    message: PropTypes.shape({}),
    i18n: PropTypes.shape({}).isRequired,
    notifyError: PropTypes.func.isRequired,
    onDeleteAttachement: PropTypes.func.isRequired,
  };
  static defaultProps = {
    message: undefined,
  };
  state = {
    attachments: [],
    isFetching: {},
    isImportModalOpen: false,
    isAttachmentsLoading: false,
  };

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.props.message) {
      this.setState(generateStateFromProps(nextProps));
    }
  }

  createHandleDeleteAttachement = index => async () => {
    this.setState(state => ({
      isFetching: {
        ...state.isFetching,
        [index]: true,
      },
    }));

    const { onDeleteAttachement, notifyError } = this.props;

    try {
      await onDeleteAttachement();
    } catch ({ message }) {
      notifyError({ message });
    }

    this.setState(state => ({
      isFetching: {
        ...state.isFetching,
        [index]: undefined,
      },
    }));
  }

  handleOpenImportModal = () => {
    this.setState({
      isImportModalOpen: true,
    });
  };

  handleCloseImportModal = () => {
    this.setState({
      isImportModalOpen: false,
    });
  };

  handleInputFileChange = async (attachments) => {
    const { onUploadAttachments, notifyError } = this.props;

    this.setState({
      isAttachmentsLoading: true,
      isImportModalOpen: false,
    });

    try {
      await onUploadAttachments({ attachments });
    } catch (errors) {
      (new Set(errors.map(err => err.message)))
        .forEach(message => notifyError({ message }));
    }

    this.setState({
      isAttachmentsLoading: false,
    });
  }

  renderImportModal = () => {
    const { i18n } = this.props;

    const errors = {};

    return (
      <Modal
        isOpen={this.state.isImportModalOpen}
        contentLabel={i18n._('draft.action.import_attachement', { defaults: 'Import attachement' })}
        title={i18n._('draft.action.import_attachement', { defaults: 'Import attachement' })}
        onClose={this.handleCloseImportModal}
      >
        <InputFileGroup
          onInputChange={this.handleInputFileChange}
          errors={errors}
          descr={i18n._('draft.attachement.form.descr', { defaults: 'Attach a file.' })}
          maxSize={getMaxSize()}
          multiple
        />
      </Modal>
    );
  }

  render() {
    const { i18n } = this.props;

    return (
      <div className="m-attachement-manager">
        <ul className="m-attachement-manager__list">
          {this.state.attachments
            .map((attachement, index) => (
              <li key={index} className="m-attachement-manager__item">
                <Link className="m-attachement-manager__file-name" href={`/api/v2/messages/${this.state.message_id}/attachments/${index}`} download={attachement.file_name}>
                  {attachement.file_name}
                </Link>
                <TextBlock className="m-attachement-manager__file-size">
                  <FileSize size={attachement.size} />
                </TextBlock>
                <Button
                  className="m-attachement-manager__file-delete"
                  onClick={this.createHandleDeleteAttachement(index)}
                  icon={this.state.isFetching[index] ? <Spinner isLoading display="inline" /> : <Icon type="remove" />}
                  aria-label={i18n._('message.compose.action.delete_attachement')}
                />
              </li>
            ))}
        </ul>
        <Button
          className="m-attachement-manager__button"
          onClick={this.handleOpenImportModal}
          icon={this.state.isAttachmentsLoading ? <Spinner isLoading display="inline" /> : <Icon type="paperclip" />}
        >
          <Trans id="message.compose.action.open_import_attachements">Add an attachement</Trans>
        </Button>
        {this.renderImportModal()}
      </div>
    );
  }
}

export default AttachmentManager;
