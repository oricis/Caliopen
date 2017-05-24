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
  }

  handleImportContact(file) {
    axios.post('/v1/imports/', {
      ...file,
    }, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then(this.handleImportContactSuccess, this.handleImportContactError);
  }

  handleImportContactSuccess() {
    this.setState({ hasImported: true });
  }

  handleImportContactError() {
    this.setState({
      errors: { bla: 'bla' },
    });
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
