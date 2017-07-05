import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslator } from '@gandi/react-translate';
import classnames from 'classnames';
import Button from '../../../../../../components/Button';
import Spinner from '../../../../../../components/Spinner';
import { CheckboxFieldGroup, SelectFieldGroup, TextFieldGroup, FieldErrors, TextareaFieldGroup } from '../../../../../../components/form';
import {
  ERROR_UNABLE_READ_PUBLIC_KEY,
  ERROR_UNABLE_READ_PRIVATE_KEY,
  ERROR_FINGERPRINTS_NOT_MATCH,
} from '../../../../../../services/openpgp-manager';
import './style.scss';

const FORM_TYPE_GENERATE = 'generate';
const FORM_TYPE_RAW = 'raw';


// class AccountOpenPGPKeyFormController {
//   $onInit() {
//     this.generateForm = { ...this.generateForm };
//     this.importForm = {};
//     this.formType = 'generate';
//   }
//
  // $onChanges(changes) {
  //   if (changes.emails && !!this.emails) {
  //     this.emailOptions = this.emails.map(email => email.address);
  //     if (this.emailOptions.length === 1) {
  //       this.generateForm = { ...this.generateForm, email: this.emailOptions[0] };
  //     }
  //   }
  // }
//
  // handleImportChanges(property, $event) {
  //   this.importForm = { ...this.importForm, [property]: $event.model };
  // }
//
  // handleGenerateChanges(property, $event) {
  //   this.generateForm = { ...this.generateForm, [property]: $event.model };
  // }
//
  // generate() {
  //   this.onGenerate({ $event: this.generateForm });
  // }
//
//   import() {
//     this.onImport({ $event: this.importForm });
//   }
// }

@withTranslator()
class AccountOpenPGPKeyForm extends Component {
  static propTypes = {
    emails: PropTypes.arrayOf(PropTypes.shape({})),
    onImport: PropTypes.func,
    onGenerate: PropTypes.func,
    importForm: PropTypes.shape({}),
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    emails: [],
    onImport: () => {},
    onGenerate: () => {},
    importForm: {},
    isLoading: false,
    className: undefined,
    children: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      formType: FORM_TYPE_GENERATE,
      hasPassphrase: false,
      generateForm: {},
      importForm: {},
    };

    this.handleSwitchFormType = this.handleSwitchFormType.bind(this);
    this.handleToggleHasPassprase = this.handleToggleHasPassprase.bind(this);
    this.handleGenerateChanges = this.handleGenerateChanges.bind(this);
    this.handleGenerateSubmit = this.handleGenerateSubmit.bind(this);
    this.handleImportChanges = this.handleImportChanges.bind(this);
    this.handleImportSubmit = this.handleImportSubmit.bind(this);
    this.initTranslations();
  }

  componentWillMount() {
    this.emailOptions = this.props.emails.map(email => ({
      label: email.address,
      value: email.address,
    }));

    if (this.emailOptions.length === 1) {
      this.setState({
        generateForm: {
          email: this.emailOptions[0].value,
        },
      });
    }

    this.setState({ importForm: this.props.importForm });
  }

  initTranslations() {
    const { __ } = this.props;

    this.errorsLabels = {
      [ERROR_UNABLE_READ_PUBLIC_KEY]: __('openpgp.feedback.unable-read-public-key'),
      [ERROR_UNABLE_READ_PRIVATE_KEY]: __('openpgp.feedback.unable-read-private-key'),
      [ERROR_FINGERPRINTS_NOT_MATCH]: __('openpgp.feedback.fingerprints-not-match'),
    };
  }

  handleSwitchFormType(event) {
    this.setState({
      formType: event.target.name,
    });
  }

  handleToggleHasPassprase() {
    this.setState(prevState => ({
      hasPassphrase: !prevState.hasPassphrase,
    }));
  }

  handleGenerateChanges(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      generateForm: {
        ...prevState.generateForm,
        [name]: value,
      },
    }));
  }

  handleGenerateSubmit(event) {
    event.preventDefault();
    this.props.onGenerate(this.state.generateForm);
  }

  handleImportChanges(event) {
    const { name, value } = event.target;

    this.setState(prevState => ({
      importForm: {
        ...prevState.importForm,
        [name]: value,
      },
    }));
  }

  handleImportSubmit(event) {
    event.preventDefault();
    this.props.onImport(this.state.importForm);
  }

  render() {
    // XXX: note on importForm, errors comes from props and form items from this.state since form is
    // not real time saved in redux store
    const { __, isLoading, className, importForm, children } = this.props;
    const generateHollowProp = this.state.formType === FORM_TYPE_GENERATE ? { display: 'hollow' } : {};
    const rawHollowProp = this.state.formType === FORM_TYPE_RAW ? { display: 'hollow' } : {};

    return (
      <div className={classnames('m-account-openpgp-form', className)}>
        <div className="m-account-openpgp-form__main">
          {children}

          <div className="m-account-openpgp-form__switch-mode-container">
            <Button
              onClick={this.handleSwitchFormType}
              name={FORM_TYPE_GENERATE}
              {...generateHollowProp}
            >
              {__('account.openpgp.action.switch-generate-key')}
            </Button>
            <Button
              onClick={this.handleSwitchFormType}
              name={FORM_TYPE_RAW}
              {...rawHollowProp}
            >
              {__('account.openpgp.action.switch-import-raw-key')}
            </Button>
          </div>
        </div>
        {this.state.formType === FORM_TYPE_GENERATE && (
          <form onSubmit={this.handleGenerateSubmit}>
            {
              this.emailOptions.length !== 1 && (
                <SelectFieldGroup
                  className="m-account-openpgp-form__field-group"
                  label={__('account.openpgp.form.email.label')}
                  value={this.state.generateForm.email}
                  onChange={this.handleGenerateChanges}
                  name="email"
                  options={this.emailOptions}
                  required="true"
                />
              )
            }
            {this.emailOptions.length === 1 && (
              <p className="m-account-openpgp-form__field-group">
                {__('account.openpgp.form.email.label')}{' '}{this.state.generateForm.email}
              </p>
            )}
            <div className="m-account-openpgp-form__field-group">
              {__('account.openpgp.has-passphrase')}
              {' '}
              <CheckboxFieldGroup
                displaySwitch
                label={__('account.openpgp.has-passphrase')}
                value={this.state.hasPassphrase}
                onChange={this.handleToggleHasPassprase}
              />
            </div>

            {this.state.hasPassphrase && (
              <div className="m-account-openpgp-form__field-group">
                <TextFieldGroup
                  label={__('account.openpgp.form.passphrase.label')}
                  value={this.state.generateForm.passphrase}
                  onChange={this.handleGenerateChanges}
                  name="passphrase"
                />
              </div>
            )}
            <div className="m-account-openpgp-form__field-group">
              <Button type="submit" shape="plain">
                <Spinner isLoading={isLoading} />
                {' '}
                {__('account.openpgp.action.create')}
              </Button>
            </div>
          </form>
        )}
        {this.state.formType === FORM_TYPE_RAW && (
          <form onSubmit={this.handleImportSubmit}>
            {
              importForm.errors.global && (
                <FieldErrors
                  className="m-account-openpgp-form__field-group"
                  errors={importForm.errors.global.map(key => this.errorsLabels[key])}
                />
              )
            }
            <TextareaFieldGroup
              className="m-account-openpgp-form__field-group"
              label={__('account.openpgp.form.public-key.label')}
              value={this.state.importForm.publicKeyArmored}
              onChange={this.handleImportChanges}
              name="publicKeyArmored"
              errors={
                importForm.errors.publicKeyArmored &&
                  importForm.errors.publicKeyArmored.map(key => this.errorsLabels[key])
              }
            />
            <TextareaFieldGroup
              className="m-account-openpgp-form__field-group"
              label={__('account.openpgp.form.private-key.label')}
              value={this.state.importForm.privateKeyArmored}
              onChange={this.handleImportChanges}
              name="privateKeyArmored"
              errors={
                importForm.errors.privateKeyArmored &&
                  importForm.errors.privateKeyArmored.map(key => this.errorsLabels[key])
              }
            />
            <Button
              className="m-account-openpgp-form__field-group"
              type="submit"
              shape="plain"
            >
              <Spinner isLoading={isLoading} />
              {__('account.openpgp.action.add')}
            </Button>
          </form>
        )
      }
      </div>
    );
  }
}

export default AccountOpenPGPKeyForm;
