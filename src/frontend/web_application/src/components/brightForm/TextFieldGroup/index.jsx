import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import { InputText, FieldErrors } from '..';
import './style.scss';


class TextFieldGroup extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    showLabelforSr: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.node),
    expanded: PropTypes.bool,
    className: PropTypes.string,
    display: PropTypes.oneOf(['inline', 'block']),
  };

  static defaultProps = {
    id: undefined,
    showLabelforSr: false,
    errors: [],
    expanded: true,
    className: undefined,
    display: 'block',
  };

  state = {}

  render() {
    const {
      id = uuidV1(),
      label,
      errors,
      expanded,
      className,
      showLabelforSr,
      display,
      ...inputProps
    } = this.props;

    const hasError = errors.length > 0;

    const groupClassName = classnames(className, 'm-text-field-group', {
      'm-text-field-group--inline': display === 'inline',
    });

    const labelClassName = classnames('m-text-field-group__label', {
      'show-for-sr': showLabelforSr,
      'm-text-field-group--inline__label': display === 'inline',
    });

    const inputClassName = classnames('m-text-field-group__input', {
      'm-text-field-group--inline__input': display === 'inline',
    });

    const errorsClassName = classnames('m-text-field-group__errors', {
      'm-text-field-group--inline__errors': display === 'inline',
    });

    return (
      <div className={groupClassName}>
        <label htmlFor={id} className={labelClassName}>{label}</label>
        <InputText
          id={id}
          className={inputClassName}
          expanded={expanded}
          hasError={hasError}
          {...inputProps}
        />
        { errors.length > 0 && (
          <FieldErrors className={errorsClassName} errors={errors} />
        )}
      </div>
    );
  }
}

export default TextFieldGroup;
