import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../../components';

class BirthdayDetails extends PureComponent {
  static propTypes = {
    birthday: PropTypes.string.isRequired,
  };

  render() {
    const { birthday } = this.props;

    return (
      <span className="m-birthday-details">
        {birthday && <Icon rightSpaced type="birthday-cake" />}
        {birthday}
      </span>
    );
  }
}

export default BirthdayDetails;
