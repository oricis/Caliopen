import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import { Icon } from '../../../../components';

@withI18n()
class ImDetails extends Component {
  static propTypes = {
    im: PropTypes.shape({}).isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    this.initTranslations();
  }

  initTranslations() {
    const { i18n } = this.props;
    this.imTypesTranslations = {
      work: i18n._('contact.im_type.work', { defaults: 'Professional' }),
      home: i18n._('contact.im_type.home', { defaults: 'Personal' }),
      other: i18n._('contact.im_type.other', { defaults: 'Other' }),
    };
  }

  render() {
    const {
      im,
    } = this.props;

    return (
      <span className="m-im-details">
        <Icon rightSpaced type="comment" />
        {im.address}
        {' '}
        <small><em>{this.imTypesTranslations[im.type]}</em></small>
      </span>
    );
  }
}

export default ImDetails;
