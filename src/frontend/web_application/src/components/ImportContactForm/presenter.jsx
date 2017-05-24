import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FieldErrors } from '../form';
import Button from '../Button';
import Icon from '../Icon';

import './style.scss';

const VALID_EXT = ['vcf', 'vcard']; // Valid file extensions for input#file

const File = ({ file, onRemove, __ }) => (
  <div className="m-import-contact-form__file">
    <span className="m-import-contact-form__file-name">{file.name}</span>
    <span className="m-import-contact-form__file-size">{ __('import-contact.file.size', { size: file.size / 1000 }) }</span>
    <Button
      className="m-import-contact-form__remove-button"
      display="inline"
      icon="remove"
      value={file}
      onClick={onRemove}
    />
  </div>
);

File.propTypes = {
  onRemove: PropTypes.func.isRequired,
  file: PropTypes.shape({}).isRequired,
  __: PropTypes.func.isRequired,
};

const InputFile = ({ hideInput, onChange, errors, __ }) => {
  const validExt = VALID_EXT.map(ext => `.${ext}`);

  return (
    <div className={classnames({ 'm-import-contact-form__input-group--hidden': hideInput })}>
      <label htmlFor="files" className="m-import-contact-form__label">
        <span className="m-import-contact-form__label-button"><Icon type="plus" /></span>
        <span className="m-import-contact-form__label-text">{__('import-contact.form.add_a_file.label')}</span>
        <span className="m-import-contact-form__label-icon"><Icon type="folder" /></span>
        <input
          id="files"
          type="file"
          name="files"
          value=""
          className="m-import-contact-form__input"
          onChange={onChange}
          accept={validExt}
        />
      </label>
      { errors &&
        <FieldErrors errors={errors} />
      }
    </div>
  );
};

InputFile.propTypes = {
  __: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  hideInput: PropTypes.bool.isRequired,
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
    const file = ev.target.files[0];
    this.props.onSubmit({ file });
  }

  resetForm() {
    this.setState({
      file: null,
      fieldError: [],
    });
  }

  validateField(file) {
    const { __ } = this.props;
    const error = __('import-contact.form.error.no_valid_ext');
    const ext = file.name ? file.name.split('.').pop() : null;

    if (ext && VALID_EXT.includes(ext)) {
      this.setState({
        file,
        fieldError: [],
      });
    } else {
      this.setState({
        file: null,
        fieldError: [error],
      });
    }
  }
  renderButtons() {
    const { __, onCancel } = this.props;

    return (
      <div className="m-import-contact-form__buttons">
        {!this.props.hasImported &&
          <Button
            className="m-import-contact-form__button"
            shape="hollow"
            onClick={onCancel}
          >{__('general.action.cancel')}</Button>
        }

        {this.state.file && !this.props.hasImported &&
          <Button
            className="m-import-contact-form__button m-import-contact-form__button--right"
            type="submit"
            shape="plain"
            icon="download"
          >{__('import-contact.action.import')}</Button>
        }

        {this.props.hasImported &&
          <Button
            className="m-import-contact-form__button m-import-contact-form__button--right"
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
    const hideInput = file !== null && true;

    return (
      <div className="m-import-contact-form">
        {!hasImported ?
          <form
            id="import-contact-form"
            onSubmit={this.handleSubmitForm}
          >
            <p>{__('import-contact.form.descr')}</p>
            {errors.length > 0 && <FieldErrors errors={allErrors} /> }
            {file && <File file={file} onRemove={this.resetForm} __={__} /> }
            <InputFile
              hideInput={hideInput}
              onChange={this.handleInputChange}
              errors={fieldError} __={__}
            />
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
