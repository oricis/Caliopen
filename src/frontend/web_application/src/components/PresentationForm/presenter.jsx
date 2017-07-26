import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup, FieldErrors, CheckboxFieldGroup } from '../form';

const DISPLAY_PREVIEW = ['1 line', '2 lines', 'Bla'];

function generateStateFromProps(props, prevState) {
  return {
    settings: {
      ...prevState.settings,
      ...props.settings,
    },
  };
}

class PresentationForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errors: {},
  };

  state = {
    settings: {
      show_avatar_inbox: null,
      show_unread_msg_bolder: null,
      show_recent_msg_on_top: null,
      show_msg_in_conversation: null,
      display_preview_inbox: null,
    },
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
  }

  getOptionsFromArray = (options, setting) => {
    const selectedOptions = options.map(value => ({
      value,
      label: value,
      selected: setting === value && setting !== null && true,
    }));

    return selectedOptions;
  }

  handleSubmit = () => {
    const { settings } = this.state;
    this.props.onSubmit({ settings });
  }

  handleInputChange = (/* ev */) => {
    // const { name, value } = ev.target;

    // this.setState((prevState) => {});
  }

  handleSwitchChange = (/* ev */) => {
    // const { name, value } = ev.target;

    // this.setState((prevState) => {});
  }

  render() {
    const { errors, __ } = this.props;

    const displayPreviewOptions = this.getOptionsFromArray(
      DISPLAY_PREVIEW,
      this.state.settings.display_preview_inbox
    );

    return (
      <FormGrid method="post" className="m-presentation-form" name="presentation_form">
        {errors.global && errors.global.length !== 0 && (
        <FormRow>
          <FormColumn bottomSpace>
            <FieldErrors errors={errors.global} />
          </FormColumn>
        </FormRow>
        )}
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <CheckboxFieldGroup
              name="show_avatar_inbox"
              value={this.state.settings.show_avatar_inbox}
              onChange={this.handleSwitchChange}
              label={__('settings.presentation.show_avatar_inbox.label')}
              checked={this.state.settings.show_avatar_inbox ? true : null}
              showTextLabel
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <CheckboxFieldGroup
              name="show_unread_msg_bolder"
              value={this.state.settings.show_unread_msg_bolder}
              onChange={this.handleSwitchChange}
              label={__('settings.presentation.show_unread_msg_bolder.label')}
              checked={this.state.settings.show_unread_msg_bolder && true}
              showTextLabel
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <CheckboxFieldGroup
              name="show_recent_msg_on_top"
              value={this.state.settings.show_recent_msg_on_top}
              onChange={this.handleSwitchChange}
              label={__('settings.presentation.show_recent_msg_on_top.label')}
              checked={this.state.settings.show_recent_msg_on_top && true}
              showTextLabel
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <CheckboxFieldGroup
              name="show_msg_in_conversation"
              value={this.state.settings.show_msg_in_conversation}
              onChange={this.handleSwitchChange}
              label={__('settings.presentation.show_msg_in_conversation.label')}
              checked={this.state.settings.show_msg_in_conversation && true}
              showTextLabel
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace >
            <SelectFieldGroup
              name="display_preview_inbox"
              defaultValue={this.state.settings.language}
              onChange={this.handleInputChange}
              label={__('settings.presentation.display.label')}
              options={displayPreviewOptions}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" className="m-presentation-form__action" bottomSpace>
            <Button
              type="submit"
              onClick={this.handleSubmit}
              shape="plain"
            >{__('settings.presentation.update.action')}</Button>
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default PresentationForm;
