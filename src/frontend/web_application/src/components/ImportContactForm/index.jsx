import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

import './style.scss';

class ImportContactForm extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(ev) {
    const file = ev.target.file;
    this.setState({
      file,
    });
  }

  onInputChange(ev) {
    const file = ev.target.value;
    this.setState({
      file,
    });
  }

  render() {
    const { __ } = this.props;

    return (
      <div className="m-import-contact-form">
        <p>{__('You can import one one *.vcf from your hard drive.')}</p>
        <form>
          <div className="m-import-contact-form__files">
            <input
              type="file"
              name="file"
              className="m-import-contact-form__input"
              onChange={this.onInputChange}
            />
          </div><br />
          {this.state.file}
          <Button
            className="m-import-contact-form__submit"
            type="submit"
            icon="download"
            shape="plain"
            disabled={this.state.file === null}
          >{__('contacts.action.import_contacts')}</Button>
        </form>

      </div>
    );
  }
}

export default ImportContactForm;
