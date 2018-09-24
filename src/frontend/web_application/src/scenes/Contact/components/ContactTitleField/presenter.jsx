import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { formatName } from '../../../../services/contact';
import './style.scss';

class ContactTitleField extends PureComponent {
  static propTypes = {
    contact: PropTypes.shape({}).isRequired,
    contactDisplayFormat: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const {
      contact, contactDisplayFormat: format, className, onClick,
    } = this.props;

    return (
      <button
        className={classnames(className, 's-contact-title-field')}
        onClick={onClick}
      >
        {formatName({ contact, format })}
      </button>
    );
  }
}

export default ContactTitleField;
