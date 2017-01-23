import React, { Component } from 'react';
import Icon from '../../../../components/Icon';
import Subtitle from '../../../../components/Subtitle';
import { FormGrid, FormRow, FormColumn, SelectFieldGroup } from '../../../../components/form';

import './style.scss';

class DevicesManagment extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <FormGrid>
        <FormRow>
          <FormColumn size="shrink">
            <label htmlFor="select-device">Select a device to edit:</label>
          </FormColumn>
          <FormColumn size="shrink">
            <SelectFieldGroup
              label="Select a device to edit"
              name="select-device"
              showLabelforSr
              options={[{ value: 'PC maison', label: 'PC maison' }, { value: 'Android', label: 'Android' }, { value: 'Laptop', label: 'Laptop' }]}
            />
          </FormColumn>
        </FormRow>
      </FormGrid>
    );
  }
}

export default DevicesManagment;
