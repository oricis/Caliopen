import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { getPiClass } from '../../../../services/pi';

import './style.scss';

class ProtocolSwitch extends PureComponent {
  static propTypes = {
    newProtocol: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    pi: PropTypes.number.isRequired,
  };

  protocolIcon = (protocol) => {
    switch (protocol) {
      case 'facebook':
        return 'facebook-square';
      case 'twitter':
        return 'twitter';
      case 'sms':
        return 'phone';
      case 'email':
        return 'envelope';
      default:
        return 'comment';
    }
  }

  render() {
    const { pi, newProtocol, date } = this.props;

    return (
      <div className={`m-protocol-switch ${getPiClass(pi)}`}>
        <div className="m-protocol-switch__bar" />
        <i className={`fa fa-${this.protocolIcon(newProtocol)}`} />&nbsp;
        <Moment fromNow locale="fr">{date}</Moment>
      </div>
    );
  }
}

export default ProtocolSwitch;
