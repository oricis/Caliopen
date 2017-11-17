import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputFileGroup from '../../../../components/form/InputFileGroup';
import Button from '../../../../components/Button';
import Spinner from '../../../../components/Spinner';

import './style.scss';

const VALID_EXT = ['.vcf', '.vcard']; // Valid file extensions for input#file
const MAX_SIZE = 5000000;

class ImportContactForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    errors: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
    formatNumber: PropTypes.func.isRequired,
    hasImported: PropTypes.bool,
    isLoading: PropTypes.bool,
    formAction: PropTypes.string,
  };

  static defaultProps = {
    onCancel: null,
    errors: {},
    hasImported: false,
    isLoading: false,
    formAction: '',
  };

  state = {
    file: null,
  };

  handleInputFileChange = (file) => {
    this.setState({
      file,
    });
  }

  handleSubmitForm = (ev) => {
    ev.preventDefault();
    const { file } = this.state;
    this.props.onSubmit({ file });
  }

  renderButtons() {
    const { __, onCancel, isLoading } = this.props;

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
            icon={isLoading ? (<Spinner isLoading display="inline" />) : 'download'}
            disabled={isLoading}
          >{__('import-contact.action.import')}</Button>
        }

        {this.props.hasImported &&
          <Button
            className="m-import-contact-form__button m-import-contact-form__button--right"
            shape="plain"
            onClick={onCancel}
          >{__('import-contact.form.button.close')}</Button>
        }
      </div>
    );
  }

  render() {
    const { __, formatNumber, hasImported, errors, formAction } = this.props;

    return (
      <form
        className="m-import-contact-form"
        onSubmit={this.handleSubmitForm}
        action={formAction}
        method="post"
        encType="multipart/form-data"
      >
        {!hasImported ?
          <InputFileGroup
            onInputChange={this.handleInputFileChange}
            errors={errors}
            descr={__('import-contact.form.descr')}
            fileTypes={VALID_EXT}
            maxSize={MAX_SIZE}
            __={__}
            formatNumber={formatNumber}
          />
        :
          <p>{__('import-contact.form.success')}</p>
      }
        {this.renderButtons()}
      </form>
    );
  }
}

export default ImportContactForm;
