import React, { Component } from 'react';
import DevicesManagment from './components/DevicesManagment';
import BlockList, { ItemContent } from '../../components/BlockList';


import './style.scss';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="s-settings">
        <BlockList className="s-settings__nav">
          <ItemContent>User Interface</ItemContent>
          <ItemContent>View</ItemContent>
          <ItemContent>Contacts</ItemContent>
          <ItemContent>Calendar</ItemContent>
          <ItemContent>Server</ItemContent>
          <ItemContent>Accounts</ItemContent>
          <ItemContent>Devices</ItemContent>
        </BlockList>
        <div className="s-settings__pannel"><DevicesManagment /></div>
      </div>
    );
  }
}

export default Settings;
