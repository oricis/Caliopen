import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldErrors } from '../form';
import Button from '../Button';
import Icon from '../Icon';

import './style.scss';

const VALID_EXT = ['vcf', 'vcard']; // Valid file extensions for input#file

const File = ({ file, onClick }) => (
  <div className="m-import-contact-form__file">
    <span className="m-import-contact-form__file-name">{file.name}</span>
    <span className="m-import-contact-form__file-size">{file.size / 1000} ko</span>
    <Button
      className="m-import-contact-form__remove-button"
      display="inline"
      icon="remove"
      value={file}
      onClick={onClick}
    />
  </div>
);

File.propTypes = {
  onClick: PropTypes.func.isRequired,
  file: PropTypes.shape({}).isRequired,
};

const InputFile = ({ onChange, errors, __ }) => (
  <div>
    <label htmlFor="files[]" className="m-import-contact-form__label">
      <span className="m-import-contact-form__label-button"><Icon type="plus" /></span>
      <span className="m-import-contact-form__label-text">{__('import-contact.form.add_a_file.label')}</span>
      <span className="m-import-contact-form__label-icon"><Icon type="folder" /></span>
      <input
        id="files"
        type="file"
        name="files[]"
        className="m-import-contact-form__input"
        onChange={onChange}
        accept=".vcf, .vcard"
      />
    </label>
    { errors &&
      <FieldErrors errors={errors} />
    }
  </div>
);

InputFile.propTypes = {
  __: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
};


class ImportContactForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    errors: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
    hasImported: PropTypes.bool,
  };

  static defaultProps = {
    onCancel: null,
    errors: {},
    hasImported: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fieldError: [],
      formData: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.validateField = this.validateField.bind(this);
  }

  handleInputChange(ev) {
    const files = ev.target.files.length > 0 ? ev.target.files : null;
    if (files) { this.validateField(files[0]); }
  }

  handleSubmitForm(ev) {
    ev.preventDefault();
    const { formData } = this.state;
    this.props.onSubmit({ formData });
  }

  resetForm() {
    document.getElementById('import-contact-form').reset();
    this.setState({
      file: null,
      fieldError: [],
      formData: {},
    });
  }

  validateField(file) {
    const { __ } = this.props;
    const error = __('import-contact.form.error.no_valid_ext');
    const ext = file.name ? file.name.split('.').pop() : null;
    const formData = new FormData();

    if (ext && VALID_EXT.includes(ext)) {
      this.setState({
        file: { file, name: file.name, size: file.size },
        fieldError: [],
        formData: formData.append('data', file),
      });
    } else {
      this.setState({
        file: null,
        fieldError: [error],
        formData: {},
      });
    }
  }
  renderButtons() {
    const { __, onCancel } = this.props;

    return (
      <div className="m-import-contact-form__buttons">
        {!this.props.hasImported &&
          <Button
            className="m-import-contact-form__cancel"
            shape="hollow"
            onClick={onCancel}
          >{__('general.action.cancel')}</Button>
        }

        {this.state.file && !this.props.hasImported &&
          <Button
            className="m-import-contact-form__submit"
            type="submit"
            shape="plain"
            icon="download"
          >{__('import-contact.action.import')}</Button>
        }

        {this.props.hasImported &&
          <Button
            className="m-import-contact-form__submit"
            shape="plain"
            icon="check"
            onClick={onCancel}
          >{__('ok')}</Button>
        }
      </div>
    );
  }

  render() {
    const { __, hasImported, errors } = this.props;
    const { file, fieldError } = this.state;
    const allErrors = Object.keys(errors).map(key => errors[key]);

    return (
      <div className="m-import-contact-form">
        {!hasImported ?
          <form id="import-contact-form" onSubmit={this.handleSubmitForm}>
            <p>{__('import-contact.form.descr')}</p>
            {errors.length > 0 && <FieldErrors errors={allErrors} /> }
            {file ?
              <File file={file} onClick={this.resetForm} />
            :
              <InputFile onChange={this.handleInputChange} errors={fieldError} __={__} />
            }
            {this.renderButtons()}
          </form>
          :
          <form id="import-contact-form">
            <p>{__('Successfuly imported!')}</p>
            {this.renderButtons()}
          </form>
        }
      </div>
    );
  }
}

export default ImportContactForm;
