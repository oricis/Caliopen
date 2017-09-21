import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ImportContactForm from '../../../../components/ImportContactForm';

class ImportContact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onUploadSuccess: PropTypes.func,
    notifySuccess: PropTypes.func.isRequired,
    notifyError: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onCancel: null,
    onUploadError: (err) => { throw err; },
    onUploadSuccess: () => {},
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
      notifySuccess({ message: __('import-contact.feedback.successfull'), duration: 0 });
      onUploadSuccess();
    });
  }

  handleImportContactError({ response }) {
    const { notifyError, __ } = this.props;

    if (response.status === 400) {
      return notifyError({ message: __('import-contact.feedback.error-file'), duration: 0 });
    }

    if (response.status === 422) {
      return notifyError({ message: __('import-contact.feedback.error-contact'), duration: 0 });
    }

    return notifyError({ message: __('import-contact.feedback.unexpected-error'), duration: 0 });
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
