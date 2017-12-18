import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown, { withDropdownControl } from '../../../../../../components/Dropdown';
import Button from '../../../../../../components/Button';
import VerticalMenu, { VerticalMenuItem } from '../../../../../../components/VerticalMenu';
import TimelineFilter from '../../../TimelineFilter';
import './style.scss';

const DropdownControlButton = withDropdownControl(Button);

class TimelineFilterContainer extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };
  state = {};

  render() {
    const { __ } = this.props;

    return (
      <TimelineFilter render={(options, currentFilter) => (
        <div className="m-timeline-filter-container">
          <DropdownControlButton
            toggleId="timeline-filter_navigation_dropdown"
            title={__('navigation.actions.toggle-timeline-filter')}
            className="m-timeline-filter-container__dropdown-control"
            icon="filter"
          >
            {options.find(option => option.value === currentFilter).label}
          </DropdownControlButton>
          <Dropdown
            id="timeline-filter_navigation_dropdown"
            className="m-timeline-filter-container__dropdown"
            closeOnClick
          >
            <VerticalMenu>
              {options.map((option, i) => (
                <VerticalMenuItem key={i} className="m-timeline-filter-container__dropdown-item">
                  <Button
                    onClick={option.select}
                    display="expanded"
                    className="m-timeline-filter-container__dropdown-button"
                  >{option.label}</Button>
                </VerticalMenuItem>
              ))}
            </VerticalMenu>
          </Dropdown>
        </div>
        )}
      />
    );
  }
}

export default TimelineFilterContainer;
