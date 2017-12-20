import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import DefList from '../../../../components/DefList';

const DeviceInformation = ({ device, locale, i18n }) => (
  <DefList
    definitions={[
      { title: i18n.t`device.info.date_insert`, descriptions: [<Moment format="LLL" locale={locale}>{device.date_insert}</Moment>] },
      { title: i18n.t`device.info.last_seen`, descriptions: [<Moment format="LLL" locale={locale}>{device.last_seen}</Moment>] },
      { title: i18n.t`device.info.os`, descriptions: [device.os] },
      { title: i18n.t`device.info.os-version`, descriptions: [device.os_version] },
    ]}
  />
);

DeviceInformation.propTypes = {
  device: PropTypes.shape({}).isRequired,
  locale: PropTypes.string,
  i18n: PropTypes.shape({}).isRequired,
};
DeviceInformation.defaultProps = {
  locale: undefined,
};

export default DeviceInformation;
