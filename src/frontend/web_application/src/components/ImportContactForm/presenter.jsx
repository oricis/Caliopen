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
    importContacts: PropTypes.func,
    onCancel: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    importContacts: null,
    onCancel: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      error: null,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.validate = this.validate.bind(this);
  }

  onInputChange(ev) {
    const files = ev.target.files.length > 0 ? ev.target.files : null;
    if (files) { this.validate(files[0]); }
  }

  resetForm() {
    document.getElementById('import-contact-form').reset();
    this.setState({
      file: null,
      error: null,
    });
  }

  validate(file) {
    const { __ } = this.props;
    const error = __('import-contact.form.error.no_valid_ext');
    const ext = file.name ? file.name.split('.').pop() : null;

    if (ext && VALID_EXT.includes(ext)) {
      this.setState({
        file: { file, name: file.name, size: file.size },
        error: null,
      });
    } else {
      this.setState({
        file: null,
        error,
      });
    }
  }
  renderButtons() {
    const { __, importContacts, onCancel } = this.props;

    return (
      <div className="m-import-contact-form__buttons">
        <Button
          className="m-import-contact-form__cancel"
          shape="hollow"
          onClick={onCancel}
        >{__('general.action.cancel')}</Button>

        {this.state.file &&
          <Button
            className="m-import-contact-form__submit"
            type="submit"
            shape="plain"
            icon="download"
            onClick={importContacts}
          >{__('import-contact.action.import')}</Button>
        }
      </div>
    );
  }

  render() {
    const { __ } = this.props;
    const { file, error } = this.state;

    return (
      <div className="m-import-contact-form">
        <form id="import-contact-form">
          <p>{__('import-contact.form.descr')}</p>
          {file ?
            <File file={file} onClick={this.resetForm} />
          :
            <InputFile onChange={this.onInputChange} errors={[error]} __={__} />
          }
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

export default ImportContactForm;
