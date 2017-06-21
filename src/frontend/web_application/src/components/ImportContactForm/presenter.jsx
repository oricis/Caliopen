import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputFileGroup from '../form/InputFileGroup';
import Button from '../Button';

import './style.scss';

const VALID_EXT = ['.vcf', '.vcard']; // Valid file extensions for input#file

class ImportContactForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    errors: PropTypes.shape({}),
    __: PropTypes.func.isRequired,
    hasImported: PropTypes.bool,
    formAction: PropTypes.string,
  };

  static defaultProps = {
    onCancel: null,
    errors: {},
    hasImported: false,
    formAction: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };

    this.handleInputFileChange = this.handleInputFileChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  handleInputFileChange(file) {
    this.setState({
      file,
    });
  }

  handleSubmitForm(ev) {
    ev.preventDefault();
    const { file } = this.state;
    this.props.onSubmit({ file });
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
            onClick={onCancel}
          >{__('import-contact.form.button.close')}</Button>
        }
      </div>
    );
  }

  render() {
    const { __, hasImported, errors, formAction } = this.props;

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
            __={__}
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
