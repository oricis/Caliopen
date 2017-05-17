import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import { FieldErrors } from '../form';
import Button from '../Button';
import Icon from '../Icon';

import './style.scss';

class ImportContactForm extends Component {
  static propTypes = {
    uploadFile: PropTypes.func,
    onCancel: PropTypes.func,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    uploadFile: null,
    onCancel: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      errors: [],
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onResetForm = this.onResetForm.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  onInputChange(ev) {
    const file = ev.target.files[0];
    this.validate(file);
  }

  onResetForm() {
    document.getElementById('import-contact-form').reset();
    this.setState({
      files: [],
      errors: [],
    });
  }

  validate(file) {
    const ext = file.name.split('.').pop();
    if (ext === 'vcf' || ext === 'vcard') {
      this.setState({
        files: [{ file, name: file.name, size: file.size }],
        errors: [],
      });
    } else {
      this.setState({
        file: [],
        errors: ['Only .vcf or .vcard files'],
      });
    }
  }
  renderButtons() {
    const { __, uploadFile, onCancel } = this.props;

    return (
      <div className="m-import-contact-form__buttons">
        <Button
          className="m-import-contact-form__cancel"
          shape="hollow"
          onClick={onCancel}
        >{__('Cancel')}</Button>

        {this.state.files.length > 0 &&
          <Button
            className="m-import-contact-form__submit"
            type="submit"
            shape="plain"
            icon="download"
            onClick={uploadFile}
          >{__('Import')}</Button>
        }
      </div>
    );
  }

  render() {
    const { __ } = this.props;

    return (
      <div className="m-import-contact-form">
        <form id="import-contact-form">
          <p>{__('You can import one .vcf or .vcard file.')}</p>
          {this.state.files.length > 0 ? this.state.files.map(file =>
            <div className="m-import-contact-form__files" key={uuidV1()}>
              <div className="m-import-contact-form__file">
                <span className="m-import-contact-form__file-name">{file.name} </span>
                <span className="m-import-contact-form__file-size">{file.size} o</span>
                <Button
                  className="m-import-contact-form__remove-button"
                  display="inline"
                  icon="remove"
                  value={file}
                  onClick={this.onResetForm}
                />
              </div>
            </div>
            ) : (
              <div>
                <label htmlFor="files[]" className="m-import-contact-form__label">
                  <span className="m-import-contact-form__add-button"><Icon type="plus" /></span>
                  <span className="m-import-contact-form__add-label">{__('Add a file')}</span>
                  <span className="m-import-contact-form__add-icon"><Icon type="folder" /></span>
                  <input
                    id="files"
                    type="file"
                    name="files[]"
                    className="m-import-contact-form__input"
                    onChange={this.onInputChange}
                  />
                </label>
                { this.state.errors.length > 0 && (
                  <FieldErrors className="m-text-field-group__errors" errors={this.state.errors} />
                )}
              </div>
            )
          }
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

export default ImportContactForm;
