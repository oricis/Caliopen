import React, { Component, PropTypes } from 'react';
import Icon from '../../../../components/Icon';
import Badge from '../../../../components/Badge';
import Link from '../../../../components/Link';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup, TextFieldGroup } from '../../../../components/form';

import './style.scss';

const devices = [
  /* eslint-disable */
  {'device': {'id': '4537-es79-8tez', name: 'Laptop home', isConnected: true, 'pi': 45, 'icon': 'laptop'}},
  {'device': {'id': '6330-b87e-ebf1', name: 'Smartphone', isConnected: false, 'pi': 15, 'icon': 'lock'}},
  {'device': {'id': '4537-bl89-uyfu', name: 'my smart fridge is smart', isConnected: false, 'pi': 5, 'icon': 'laptop'}},
  {'device': {'id': '1542-ta79-85f1', name: 'Desktop', isConnected: true, 'pi': 35, 'icon': 'laptop'}},
];
/* eslint-enable */

class DisplayDevice extends Component {
  render() {
    const deviceId = this.props.deviceId;
    let thisDevice = [];

    this.props.devicesList.map((devicesList) => {
      if (devicesList.device.id === deviceId) {
        thisDevice = devicesList.device;
      }
    });

    return (
      <FormGrid className="m-devices">
        <FormRow>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label="Name"
              name="device-name"
              value={thisDevice.name}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace>
            <TextFieldGroup
              label="Id"
              name="device-id"
              value={thisDevice.id}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace>
            P.I. <Badge>{thisDevice.pi}</Badge>
          </FormColumn>
        </FormRow>
        <FormRow><FormColumn>isConnected: {thisDevice.isConnected ? 'oui' : 'non'}</FormColumn></FormRow>
      </FormGrid>
    );
  }
}

DisplayDevice.propTypes = {
  devicesList: PropTypes.node,
  deviceId: PropTypes.string,
};


class DeviceItem extends Component {
  render() {
    return (
      <Link
        expanded
        noDecoration
        id={this.props.id}
        onClick={this.props.handleOnClick}
      >
        {this.props.name}
      </Link>
    );
  }
}

DeviceItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  handleOnClick: PropTypes.func,

};

class DevicesManagment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices,
      deviceId: '4537-es79-8tez',
    };
  }

  render() {
    const handleButtonClick = (event) => {
      this.setState({
        deviceId: event.target.id,
      });
    };
    const handleInputChange = (event) => {
      this.setState({
        deviceId: event.target.value,
      });
    };
    return (
      <div className="s-devices-management">
        <div className="s-devices-management__panel m-devices-list">
          <SelectFieldGroup
            label="Select a device"
            name="select-device"
            onChange={handleInputChange}
            options={this.state.devices.map((d) => {
              return {
                value: d.device.id,
                label: d.device.name,
              };
            })}
          />
          {this.state.deviceId !== null &&
            <DisplayDevice deviceId={this.state.deviceId} devicesList={this.state.devices} />
          }
        </div>

      </div>
    );
  }
}

export default DevicesManagment;
