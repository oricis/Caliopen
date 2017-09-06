import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../../components/Icon';
import './style.scss';

class PasswordStrength extends PureComponent {
  static propTypes = {
    strength: PropTypes.number.isRequired,
    className: PropTypes.string,
    __: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: null,
  };

  render() {
    const { strength, className, __ } = this.props;

    const feedbacks = {
      weak: __('password_strength.feedback.weak'),
      moderate: __('password_strength.feedback.moderate'),
      strong: __('password_strength.feedback.strong'),
    };

    const classNameModifiers = {
      weak: 'm-password-strength--weak',
      moderate: 'm-password-strength--moderate',
      strong: 'm-password-strength--strong',
    };

    let key;
    switch (true) {
      default:
      case strength <= 1:
        key = 'weak';
        break;
      case strength >= 2 && strength <= 3:
        key = 'moderate';
        break;
      case strength >= 4:
        key = 'strong';
        break;
    }
    const passwordStrengthClassName = classnames(
      'm-password-strength',
      classNameModifiers[key],
      className
    );

    return (
      <div className={passwordStrengthClassName}>
        <div className="m-password-strength__graph">
          <Icon type="lock" className="m-password-strength__icon" />
          <div className="m-password-strength__guide">
            <div className="m-password-strength__bar" />
          </div>
          <span className="m-password-strength__text">{feedbacks[key]}</span>
        </div>
      </div>
    );
  }
}

export default PasswordStrength;
