import React, { Component, PropTypes } from 'react';
import { FormGrid, FormRow, FormColumn, TextFieldGroup } from '../../../../../../components/form';

class DisplayDevice extends Component {
  render() {
    const thisDevice = this.props.device;

    return (
      <FormGrid className="m-devices">
        <FormRow>
          <FormColumn bottomSpace>
            <TextFieldGroup
              label="Name"
              name="device-name"
              key={thisDevice.name}
              defaultValue={thisDevice.name}
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn bottomSpace>
            ID: {thisDevice.device_id}
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace>
            PI: {thisDevice.pi}
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace>
            Type: {thisDevice.type}
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn size="shrink" bottomSpace>
            IP:
              {thisDevice.device_id}
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

DisplayDevice.propTypes = {
  device: PropTypes.node,
};

export default DisplayDevice;
