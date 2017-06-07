import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Badge from '../../../Badge';
import Button from '../../../Button';
import Icon from '../../../Icon';

const ASSOC_PROTOCOL_ICON = {
  email: 'envelope',
};

const getIconType = protocol => ASSOC_PROTOCOL_ICON[protocol];

class Recipient extends Component {
  static propTypes = {
    participant: PropTypes.shape({}).isRequired,
    onRemove: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    onRemove: () => {},
  };

  constructor(props) {
    super(props);
    this.handleClickRemove = this.handleClickRemove.bind(this);
  }

  handleClickRemove() {
    this.props.onRemove(this.props.participant);
  }

  render() {
    const { participant, __ } = this.props;

    return (
      <Badge large>
        <span>
          <Icon type={getIconType(participant.protocol)} spaced />
          <span>{participant.address}</span>
        </span>
        <Button
          className="m-recipient__col-remove m-link m-link--button"
          onClick={this.handleClickRemove}
          title={__('messages.compose.action.remove-recipient')}
        >
          <Icon type="remove" spaced />
        </Button>
      </Badge>
    );
  }
}

export default Recipient;
