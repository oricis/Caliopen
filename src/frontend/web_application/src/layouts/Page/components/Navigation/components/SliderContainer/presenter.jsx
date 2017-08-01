import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import { Range } from 'rc-slider';

import './style.scss';

class SliderContainer extends Component {
  static propTypes = {
    className: PropTypes.string,
    importanceLevelRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    setImportanceLevel: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: undefined,
  };

  componentWillMount() {
    this.ticks = new Array(10).fill(0);
  }

  handleChange = debounce((importanceLevelRange) => {
    this.props.setImportanceLevel(importanceLevelRange);
  }, 0.5 * 1000, { leading: false, trailing: true });

  renderTicks() {
    return (
      <ul className="m-slider-container__slider-tick-list">
        {this.ticks.map((tick, index) => (
          <li className="m-slider-container__slider-tick" key={index} />
        ))}
      </ul>
    );
  }

  render() {
    const { className, importanceLevelRange } = this.props;

    return (
      <div className={classnames(className, 'm-slider-container')}>
        <Range
          onChange={this.handleChange}
          defaultValue={importanceLevelRange}
          vertical
          // visibility is hardcoded in tracks, it breaks toggle dropdown
          trackStyle={[{ visibility: undefined }, { visibility: undefined }]}
        >{this.renderTicks()}</Range>
      </div>
    );
  }
}

export default SliderContainer;
