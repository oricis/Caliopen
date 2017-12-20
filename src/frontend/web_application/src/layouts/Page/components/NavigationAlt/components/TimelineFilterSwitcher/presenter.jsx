import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SelectFieldGroup } from '../../../../../../components/form';
import TimelineFilter from '../../../TimelineFilter';
import './style.scss';

class TimelineFilterContainer extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };
  state = {};

  renderSelect = (options, currentFilter) => {
    const { i18n, className } = this.props;
    const handleChange = (ev) => {
      options.find(option => option.value === ev.target.value).select();
    };

    const selectOptions = options.map(({ label, value }) => ({ label, value }));

    return (
      <SelectFieldGroup
        className={classnames('m-timeline-filter-switcher', className)}
        showLabelforSr
        label={i18n.t`timeline-filter.label`}
        options={selectOptions}
        onChange={handleChange}
        value={currentFilter}
      />
    );
  }

  render() {
    return (
      <TimelineFilter render={this.renderSelect} />
    );
  }
}

export default TimelineFilterContainer;
