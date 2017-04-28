import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from '@gandi/react-translate';
import DefList from '../../../../components/DefList';

const DeviceInformation = ({ device, __ }) => (
  <DefList
    definitions={[
      { title: __('device.info.date_insert'), descriptions: [<DateTime format="LLL">{device.date_insert}</DateTime>] },
      { title: __('device.info.last_seen'), descriptions: [<DateTime format="LLL">{device.last_seen}</DateTime>] },
      { title: __('device.info.os'), descriptions: [device.os] },
      { title: __('device.info.os-version'), descriptions: [device.os_version] },
    ]}
  />
);

DeviceInformation.propTypes = {
  device: PropTypes.shape({}).isRequired,
  __: PropTypes.func.isRequired,
};

export default DeviceInformation;
