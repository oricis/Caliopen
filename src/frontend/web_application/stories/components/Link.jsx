import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import Link from '../../src/components/Link';

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

class Links extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        noDecoration: false,
        button: false,
        expanded: false,
        active: false,
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
    return (
      <div>
        <div style={styles.component}>
          <Link {...this.state.props}>Click Me</Link>
        </div>
        <p>
          <code style={styles.code}>
            {'<Link noDecoration button expanded active />'}
          </code>
        </p>
        <ul>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="noDecoration" checked={this.state.props.noDecoration} />No decorations</label></li>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="button" checked={this.state.props.button} />Button</label></li>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="expanded" checked={this.state.props.expanded} />Expanded</label></li>
          <li><label><input type="checkbox" onChange={this.handlePropsChanges} name="active" checked={this.state.props.active} />Active</label></li>
        </ul>
      </div>
    );
  }
}

export default Links;
