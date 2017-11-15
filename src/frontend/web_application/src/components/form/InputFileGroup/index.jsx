import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputFile, FieldErrors } from '../';
import File from './components/File';

import './style.scss';

class InputFileGroup extends Component {
  static propTypes = {
    onInputChange: PropTypes.func.isRequired,
    errors: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
    formatNumber: PropTypes.func.isRequired,
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
    const { __, formatNumber, fileTypes, maxSize } = this.props;
    const errors = [];

    if (!file) {
      return Promise.reject(__('input-file-group.error.file_is_required'));
    }

    const ext = file.name ? `.${file.name.split('.').pop()}` : null;
    if (fileTypes && (!ext || !fileTypes.includes(ext))) {
      errors.push(
        __('input-file-group.error.no_valid_ext', { fileTypes: fileTypes.join(', ') })
      );
    }

    if (maxSize && file.size > maxSize) {
      errors.push(
        __('input-file-group.error.max_size', {
          maxSize: formatNumber(Math.round(maxSize / 100) / 10),
        })
      );
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    return Promise.resolve(file);
  }

  render() {
    const { __, formatNumber, errors, descr, className, fileTypes } = this.props;
    const allErrors = errors ? Object.keys(errors).map(key => errors[key]) : null;
    const acceptProp = fileTypes ? { accept: fileTypes } : {};

    return (
      <div className={classnames('m-input-file-group', className)}>
        {descr && <p>{descr}</p>}

        {errors.length > 0 && <FieldErrors errors={allErrors} /> }

        {this.state.file ?
          <File
            file={this.state.file}
            onRemove={this.resetForm}
            __={__}
            formatNumber={formatNumber}
          />
          :
          <InputFile
            onChange={this.handleInputChange}
            errors={this.state.fieldError}
            __={__}
            {...acceptProp}
            // multiple={multiple}
          />
        }
      </div>
    );
  }
}

export default InputFileGroup;
