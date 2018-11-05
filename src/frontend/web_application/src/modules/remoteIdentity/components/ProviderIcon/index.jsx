import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withI18n } from '@lingui/react';
import providerSrc from './assets/providers.svg';
import { capitalize } from '../../../../services/capitalize';

@withI18n()
class ProviderIcon extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    i18n: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    providerName: PropTypes.string.isRequired,
  };
  static defaultProps = {
    children: null,
    className: undefined,
  };

  render() {
    const { className, providerName, i18n } = this.props;

    return (
      <img
        className={classnames(className)}
        src={`${providerSrc}#${providerName}`}
        alt={i18n._('remote_identity.provider-logo', { name: capitalize(providerName) }, { defaults: '{name} logo' })}
      />
    );
  }
}

export default ProviderIcon;
