import React, { PropTypes } from 'react';
import { DateTime } from '@gandi/react-translate';
import TextBlock from '../../../../components/TextBlock';
import DefList from '../../../../components/DefList';


const DeviceInformation = ({ device, __ }) => (
  <DefList>{[
    { title: __('device.info.date_insert'), descriptions: [<TextBlock className="m-device__info"><DateTime format="LLL">{device.date_insert}</DateTime></TextBlock>] },
    { title: __('device.info.last_seen'), descriptions: [<TextBlock className="m-device__info"><DateTime format="LLL">{device.last_seen}</DateTime></TextBlock>] },
    { title: __('device.info.os'), descriptions: [<TextBlock className="m-device__info">{device.os}</TextBlock>] },
    { title: __('device.info.os-version'), descriptions: [<TextBlock className="m-device__info">{device.os_version}</TextBlock>] },
  ]}
  </DefList>
);

DeviceInformation.propTypes = {
  device: PropTypes.shape({}),
  __: PropTypes.func.isRequired,
};

export default DeviceInformation;
