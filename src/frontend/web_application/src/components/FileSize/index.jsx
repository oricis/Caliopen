import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro'; // eslint-disable-line import/no-extraneous-dependencies
import { NumberFormat } from '@lingui/react';

class FileSize extends Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
  };

  renderB() {
    const { size } = this.props;

    return <Trans id="file.size.B">{size} B</Trans>;
  }

  renderKB() {
    const { size } = this.props;
    const value = Math.round(size / 10) / 100;

    return (
      <Trans id="file.size.kB">
        <NumberFormat format={{ maximumFractionDigits: 1 }} value={value} /> kB
      </Trans>
    );
  }

  renderMB() {
    const { size } = this.props;
    const value = Math.round(size / 10000) / 100;

    return (
      <Trans id="file.size.mB">
        <NumberFormat format={{ maximumFractionDigits: 1 }} value={value} /> mB
      </Trans>
    );
  }

  renderGB() {
    const { size } = this.props;
    const value = Math.round(size / 10000000) / 100;

    return (
      <Trans id="file.size.gB">
        <NumberFormat format={{ maximumFractionDigits: 1 }} value={value} /> gB
      </Trans>
    );
  }

  renderTB() {
    const { size } = this.props;
    const value = Math.round(size / 10000000000) / 100;

    return (
      <Trans id="file.size.tB">
        <NumberFormat format={{ maximumFractionDigits: 1 }} value={value} /> tB
      </Trans>
    );
  }

  render() {
    const { size } = this.props;

    if (size / 100 < 1) {
      return this.renderB();
    }

    if (size / 1000000 < 1) {
      return this.renderKB();
    }

    if (size / 1000000000 < 1) {
      return this.renderMB();
    }

    if (size / 1000000000000 < 1) {
      return this.renderGB();
    }

    return this.renderTB();
  }
}

export default FileSize;
