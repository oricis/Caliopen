import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InstantMessage from '../InstantMessage';
import MailMessage from '../MailMessage';

class Message extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
  };

  isMail = () => {
    const { message } = this.props;

    return message.type === 'email';
  }

  render() {
    const { message } = this.props;

    return (this.isMail() ?
      <MailMessage message={message} />
      :
      <InstantMessage message={message} />
    );
  }
}

export default Message;
