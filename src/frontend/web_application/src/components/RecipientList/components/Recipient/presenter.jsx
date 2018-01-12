import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Badge from '../../../Badge';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { ASSOC_PROTOCOL_ICON } from '../../../../services/protocols-config';

const getIconType = protocol => ASSOC_PROTOCOL_ICON[protocol] || ASSOC_PROTOCOL_ICON.unknown;

class Recipient extends Component {
  static propTypes = {
    participant: PropTypes.shape({}).isRequired,
    onRemove: PropTypes.func,
    i18n: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    onRemove: () => {},
    className: undefined,
  };

  handleClickRemove = () => {
    this.props.onRemove(this.props.participant);
  }

  render() {
    const { participant, className, i18n } = this.props;

    return (
      <Badge large className={className}>
        <span>
          <Icon type={getIconType(participant.protocol)} spaced />
          <span>{participant.address}</span>
        </span>
        <Button
          className="m-recipient__col-remove"
          onClick={this.handleClickRemove}
          title={i18n._('messages.compose.action.remove-recipient', { defaults: 'Remove recipient' })}
        >
          <Icon type="remove" spaced />
        </Button>
      </Badge>
    );
  }
}

export default Recipient;
