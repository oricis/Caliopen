import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ImportContactForm from '../../../../components/ImportContactForm';

class ImportContact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    onCancel: null,
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
    this.initTranslation();
  }

  initTranslation() {
    const { __ } = this.props;
    this.localizedErrors = {
      400: __('400'),
      422: __('422'),
    };
  }

  handleImportContact(ev) {
    axios.post('/v1/imports', {
      ...ev.formValues,
    }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(this.handleImportContactSuccess, this.handleImportContactError);
  }

  handleImportContactSuccess() {
    this.setState({ hasImported: true });
  }

  handleImportContactError(err) {
    const isExpectedError = err.response &&
      err.response.status >= 400 &&
      err.response.status < 500 &&
      err.response.data.errors;

    const getLocalizedError = (msg, field) => this.localizedErrors[`${msg}_${field.toUpperCase()}`];

    if (isExpectedError) {
      const { errors } = err.response.data;
      const localizedErrors = Object.keys(errors).reduce((prev, field) => (
        { ...prev, [field]: errors[field].map(msg => getLocalizedError(msg, field)) }
      ), {});
      this.setState({ errors: localizedErrors });
    } else {
      throw err;
    }
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
      />
    );
  }
}

export default ImportContact;
