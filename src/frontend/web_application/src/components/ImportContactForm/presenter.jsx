import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import Modal from '../Modal';
import './style.scss';

const ImportContactForm = () => (
  <Modal
    className="m-import-contact-form__modal"
    title="Import Contacts"
  >
    <form>
      <p>Select a file to import</p>
      <input type="file" />
      <Button type="submit" icon="folder-open" shape="plain" />
    </form>
  </Modal>
);

ImportContactForm.propTypes = {
  onMessageView: PropTypes.func,
  onReply: PropTypes.func.isRequired,
  onForward: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  replyForm: PropTypes.node.isRequired,
  __: PropTypes.func.isRequired,
};

ImportContactForm.defaultProps = {
  onMessageView: null,
};

export default ImportContactForm;
