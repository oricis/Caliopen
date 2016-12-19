import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Button from '../src/components/Button';

const styles = {
  component: {
    margin: '1rem',
    border: '1px solid blue',
    height: '5rem',
  },
  code: {
    margin: '1rem',
    padding: '1rem',
    backgroundColor: '#333',
  },
};

class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        plain: false,
        expanded: false,
        hollow: false,
        active: false,
        alert: false,
      },
    };
    this.handlePropsChanges = this.handlePropsChanges.bind(this);
  }

  handlePropsChanges(event) {
    const { name, checked } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: checked,
      },
    }));
  }

  render() {
    console.log(this.state.props);

    return (
      <div>
        <div style={styles.component}>
          <Button {...this.state.props} onClick={action('clicked')}>Click Me</Button>
        </div>
        <p>
          <code style={styles.code}>
            {'<Button plain expanded hollow active alert />'}
          </code>
        </p>
        <ul>
          <li><label><input type="checkbox" name="plain" checked={this.state.props.plain} onChange={this.handlePropsChanges} /> Plain</label></li>
          <li><label><input type="checkbox" name="expanded" checked={this.state.props.expanded} onChange={this.handlePropsChanges} /> Expanded</label></li>
          <li><label><input type="checkbox" name="hollow" checked={this.state.props.hollow} onChange={this.handlePropsChanges} /> Hollow</label></li>
          <li><label><input type="checkbox" name="active" checked={this.state.props.active} onChange={this.handlePropsChanges} /> Active</label></li>
          <li><label><input type="checkbox" name="alert" checked={this.state.props.alert} onChange={this.handlePropsChanges} /> Alert</label></li>
        </ul>
      </div>
    );
  }
}

export default Buttons;
