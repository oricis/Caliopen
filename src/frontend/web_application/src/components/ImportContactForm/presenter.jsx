import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';

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
    };

    this.onInputChange = this.onInputChange.bind(this);
    // this.onRemoveFile = this.onRemoveFile.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  onInputChange(ev) {
    const files = ev.target.files;
    const output = [];

    if (files.length > 0) {
      /* eslint-disable */
      for (let i = 0, file; file = files[i]; i++) {
        output.push({ file, name: file.name, size: file.size })
      };
      /* eslint-enable */
    }

    this.setState({
      files: output,
    });
  }

  /*
  onRemoveFile() {
    this.setState({
      files: [],
    });
  }
  */

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
        <form>
          <p>{__('You can import .vcf or .vcard files.')}</p>
          <label htmlFor="files[]" className="m-import-contact-form__label">
            <span className="m-import-contact-form__add-button"><Icon type="plus" /></span>
            <span className="m-import-contact-form__add-label">Add a file</span>
            <span className="m-import-contact-form__add-icon"><Icon type="folder" /></span>
            <input
              id="files"
              type="file"
              name="files[]"
              className="m-import-contact-form__input"
              onChange={this.onInputChange}
            />
          </label>
          <div className="m-import-contact-form__files">
            {this.state.files.length > 0 ? this.state.files.map(file =>
              <div className="m-import-contact-form__file" key={uuidV1()}>
                <span className="m-import-contact-form__file-name">{file && file.name} </span>
                <span className="m-import-contact-form__file-size">{file && file.size} o</span>
                {file &&
                  <Button
                    className="m-import-contact-form__remove-button"
                    display="inline"
                    icon="remove"
                    value={file}
                    // onClick={this.onRemoveFile}
                  />
                }
              </div>
            )
            :
            <p>{__('No file chosen.')}</p>}
          </div>
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

export default ImportContactForm;
