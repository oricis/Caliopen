import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import InputFileGroup from '../../../../components/form/InputFileGroup';
import Button from '../../../../components/Button';
import Spinner from '../../../../components/Spinner';
import { getConfig } from '../../../../services/config';


import './style.scss';

const VALID_EXT = ['.vcf', '.vcard']; // Valid file extensions for input#file
const getMaxSize = (literalSize) => {
  const numberSize = literalSize.toLowerCase()
    .replace('kb', '000')
    .replace('mb', '000000');

  return Number(numberSize);
};

class ImportContactForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    errors: PropTypes.shape({}),
    i18n: PropTypes.shape({}).isRequired,
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
    const { onCancel, isLoading } = this.props;

    return (
      <div className="m-import-contact-form__buttons">
        {!this.props.hasImported &&
          <Button
            className="m-import-contact-form__button"
            shape="hollow"
            onClick={onCancel}
          ><Trans id="general.action.cancel">general.action.cancel</Trans></Button>
        }

        {this.state.file && !this.props.hasImported &&
          <Button
            className="m-import-contact-form__button m-import-contact-form__button--right"
            type="submit"
            shape="plain"
            icon={isLoading ? (<Spinner isLoading display="inline" />) : 'download'}
            disabled={isLoading}
          ><Trans id="import-contact.action.import">import-contact.action.import</Trans></Button>
        }

        {this.props.hasImported &&
          <Button
            className="m-import-contact-form__button m-import-contact-form__button--right"
            shape="plain"
            onClick={onCancel}
          ><Trans id="import-contact.form.button.close">import-contact.form.button.close</Trans></Button>
        }
      </div>
    );
  }

  render() {
    const { i18n, formatNumber, hasImported, errors, formAction } = this.props;
    const { maxBodySize } = getConfig();

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
            descr={i18n.t`import-contact.form.descr`}
            fileTypes={VALID_EXT}
            maxSize={getMaxSize(maxBodySize)}
            formatNumber={formatNumber}
          />
        :
          <p><Trans id="import-contact.form.success">import-contact.form.success</Trans></p>
      }
        {this.renderButtons()}
      </form>
    );
  }
}

export default ImportContactForm;
