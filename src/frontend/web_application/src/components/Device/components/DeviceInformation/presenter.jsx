import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import DefList from '../../../../components/DefList';

const DeviceInformation = ({ device, locale, __ }) => (
  <DefList
    definitions={[
      { title: __('device.info.date_insert'), descriptions: [<Moment format="LLL" locale={locale}>{device.date_insert}</Moment>] },
      { title: __('device.info.last_seen'), descriptions: [<Moment format="LLL" locale={locale}>{device.last_seen}</Moment>] },
      { title: __('device.info.os'), descriptions: [device.os] },
      { title: __('device.info.os-version'), descriptions: [device.os_version] },
    ]}
  />
);

DeviceInformation.propTypes = {
  device: PropTypes.shape({}).isRequired,
  locale: PropTypes.string,
  __: PropTypes.func.isRequired,
};
DeviceInformation.defaultProps = {
  locale: undefined,
};

export default DeviceInformation;
