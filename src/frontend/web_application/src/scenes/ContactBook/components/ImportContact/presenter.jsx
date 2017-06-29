import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ImportContactForm from '../../../../components/ImportContactForm';

class ImportContact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onUploadSuccess: PropTypes.func,
    notifySuccess: PropTypes.func,
    notifyError: PropTypes.func,
  };

  static defaultProps = {
    onCancel: null,
    onUploadError: (err) => { throw err; },
    onUploadSuccess: () => {},
    notifySuccess: () => {},
    notifyError: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      hasImported: false,
    };
    this.handleImportContact = this.handleImportContact.bind(this);
    this.handleImportContactSuccess = this.handleImportContactSuccess.bind(this);
    this.handleImportContactError = this.handleImportContactError.bind(this);
  }

  handleImportContact({ file }) {
    const data = new FormData();
    data.append('file', file);
    axios.post('/api/v1/imports', data)
      .then(this.handleImportContactSuccess, this.handleImportContactError);
  }

  handleImportContactSuccess() {
    this.setState({ hasImported: true }, () => {
      const { onUploadSuccess, notifySuccess, __ } = this.props;
      notifySuccess(__('import-contact.feedback.successfull'));
      onUploadSuccess();
    });
  }

  handleImportContactError({ response }) {
    const { notifyError, __ } = this.props;

    if (response.status === 400) {
      return notifyError(__('import-contact.feedback.error-file'));
    }

    if (response.status === 422) {
      return notifyError(__('import-contact.feedback.error-contact'));
    }

    return notifyError(__('import-contact.feedback.unexpected-error'));
  }

  render() {
    const { __, onCancel } = this.props;

    return (
      <ImportContactForm
        __={__}
        onCancel={onCancel}
        onSubmit={this.handleImportContact}
        errors={this.state.errors}
        hasImported={this.state.hasImported}
        formAction="/api/v1/imports"
      />
    );
  }
}

export default ImportContact;
