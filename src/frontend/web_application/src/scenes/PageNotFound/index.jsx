import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslator } from '@gandi/react-translate';

@withTranslator()
class PageNotFound extends PureComponent {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  render() {
    const { __ } = this.props;

    return (
      <div>{__('page not found')}</div>
    );
  }
}

export default PageNotFound;
