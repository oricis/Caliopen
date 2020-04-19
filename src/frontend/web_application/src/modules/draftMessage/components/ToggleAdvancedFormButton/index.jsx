import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from '@lingui/react';
import { Button, Icon } from '../../../../components';
import './toggle-advanced-draft-button.scss';

const ToggleAdvancedFormButton = ({
  i18n,
  handleToggleAdvancedForm,
  advancedForm,
}) => {
  const caretType = advancedForm ? 'caret-up' : 'caret-down';

  return (
    <Button
      display="expanded"
      shape="plain"
      className="m-toggle-advanced-draft-button"
      title={i18n._('draft-message.action.toggle-advanced', null, {
        defaults: 'Toggle advanced or quick message form',
      })}
      onClick={handleToggleAdvancedForm}
    >
      <Icon type="envelope" />
      <Icon type={caretType} />
    </Button>
  );
};

ToggleAdvancedFormButton.propTypes = {
  i18n: PropTypes.shape({ _: PropTypes.func }).isRequired,
  handleToggleAdvancedForm: PropTypes.func.isRequired,
  advancedForm: PropTypes.bool,
};
ToggleAdvancedFormButton.defaultProps = {
  advancedForm: false,
};

export default withI18n()(ToggleAdvancedFormButton);
