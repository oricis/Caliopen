import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans, withI18n } from 'lingui-react';
import FieldGroup from '../FieldGroup';
import InputFile from '../InputFile';

import File from './components/File';

import './style.scss';

@withI18n()
class InputFileGroup extends Component {
  static propTypes = {
    onInputChange: PropTypes.func.isRequired,
    errors: PropTypes.shape({}),
    i18n: PropTypes.shape({}).isRequired,
    // multiple: PropTypes.bool,
    fileTypes: PropTypes.arrayOf(PropTypes.string),
    maxSize: PropTypes.number,
    className: PropTypes.string,
    descr: PropTypes.string,
  };

  static defaultProps = {
    onChange: null,
    errors: {},
    fileTypes: undefined,
    maxSize: undefined,
    // multiple: false,
    className: null,
    descr: null,
  }

  state = {
    file: null,
    fieldError: [],
  };

  handleInputChange = (ev) => {
    const files = ev.target.files.length > 0 ? ev.target.files : [];

    return this.validate(files[0])
      .then((file) => {
        const { onInputChange } = this.props;
        this.setState({ file });
        onInputChange(file);
      })
      .catch(fieldError => this.setState({ fieldError }));
  }

  resetForm = () => {
    this.setState({
      file: null,
      fieldError: [],
    });

    return this.props.onInputChange(null);
  }

  validate = (file) => {
    const { i18n, fileTypes, maxSize } = this.props;
    const errors = [];

    if (!file) {
      return Promise.reject(i18n._('input-file-group.error.file_is_required', { defaults: 'A file is required' }));
    }

    const ext = file.name ? `.${file.name.split('.').pop()}` : null;
    if (fileTypes && (!ext || !fileTypes.includes(ext))) {
      errors.push((
        <Trans id="input-file-group.error.no_valid_ext">Only files {fileTypes.join(', ')}</Trans>
      ));
    }

    if (maxSize && file.size > maxSize) {
      errors.push(
        (
          <Trans
            id="input-file-group.error.max_size"
          >The file size must be under {Math.round(maxSize / 100) / 10} ko</Trans>)
      );
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    return Promise.resolve(file);
  }

  render() {
    const { errors, descr, className, fileTypes } = this.props;
    const allErrors = errors ? Object.keys(errors).map(key => errors[key]) : null;
    const acceptProp = fileTypes ? { accept: fileTypes } : {};

    return (
      <FieldGroup className={classnames('m-input-file-group', className)} errors={allErrors} >
        {descr && <p>{descr}</p>}

        {this.state.file ?
          <File
            file={this.state.file}
            onRemove={this.resetForm}
          />
          :
          <InputFile
            onChange={this.handleInputChange}
            errors={this.state.fieldError}
            {...acceptProp}
            // multiple={multiple}
          />
        }
      </FieldGroup>
    );
  }
}

export default InputFileGroup;
