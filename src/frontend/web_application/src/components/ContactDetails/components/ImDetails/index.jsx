import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';

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
      work: i18n.t`contact.im_type.work`,
      home: i18n.t`contact.im_type.home`,
      other: i18n.t`contact.im_type.other`,
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
