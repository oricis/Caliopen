import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, HorizontalScroll } from '../Navbar';

class TabList extends Component {
  static propTypes = {
    className: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.shape({})),
    requestTabs: PropTypes.func.isRequired,
    removeTab: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: undefined,
    tabs: [],
  };

  componentDidMount() {
    this.props.requestTabs();
  }

  render() {
    const { className, tabs, removeTab } = this.props;

    return (
      <HorizontalScroll className={className}>
        {tabs.map(tab => (
          <Tab tab={tab} key={tab.pathname} onRemove={removeTab} />
        ))}
      </HorizontalScroll>
    );
  }
}

export default TabList;
