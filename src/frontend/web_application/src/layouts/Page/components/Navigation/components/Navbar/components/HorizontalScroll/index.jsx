import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import Button from '../../../../../../../../components/Button';
import Icon from '../../../../../../../../components/Icon';
import NavbarItem from '../NavbarItem';
import './style.scss';

const STEP_SIZE = 200;
const SIZE_UNIT = 'px';
const VELOCITY_RIGHT = -1;
const VELOCITY_LEFT = 1;

class HorizontalScroll extends Component {
  constructor(props) {
    super(props);
    this.handleLeftTrigger = this.handleLeftTrigger.bind(this);
    this.handleRightTrigger = this.handleRightTrigger.bind(this);
    this.container = null;
    this.visibleZone = null;
    this.state = {
      hasNavigationSliders: false,
      triggerRecalc: false,
    };
  }

  componentDidMount() {
    let containerWidth;
    let visibleZoneWidth;
    this.handleZoneSizesChange = throttle(() => {
      if (
        containerWidth !== this.container.clientWidth ||
        visibleZoneWidth !== this.visibleZone.clientWidth
      ) {
        containerWidth = this.container.clientWidth;
        visibleZoneWidth = this.visibleZone.clientWidth;
        this.displayNavigationsliders({ containerWidth, visibleZoneWidth });
      }
    }, 1000, { leading: true, trailing: true });

    window.addEventListener('resize', this.handleZoneSizesChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subscribedState !== nextProps.subscribedState) {
      this.setState({
        triggerRecalc: true,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleZoneSizesChange);
  }

  setRef(name) {
    return (element) => {
      this[name] = element;
    };
  }

  getDistance(velocity) {
    const remain = (velocity === VELOCITY_RIGHT) ?
      (this.container.clientWidth + this.container.offsetLeft) - this.visibleZone.clientWidth :
      -1 * this.container.offsetLeft;

    return velocity * Math.min(STEP_SIZE, Math.max(remain, 0));
  }

  displayNavigationsliders({ containerWidth, visibleZoneWidth }) {
    const hasNavigationSliders = containerWidth > visibleZoneWidth;

    if (hasNavigationSliders !== this.state.hasNavigationSliders) {
      this.setState({ hasNavigationSliders }, () => {
        if (!hasNavigationSliders) {
          this.resetContainerPosition();
        }
      });
    }
  }

  resetContainerPosition() {
    this.container.style.left = 0;
  }

  moveContainer(velocity) {
    const distance = this.getDistance(velocity);
    if (distance) {
      this.container.style.left = `${this.container.offsetLeft + distance}${SIZE_UNIT}`;
    }
  }

  handleLeftTrigger() {
    this.moveContainer(VELOCITY_LEFT);
  }

  handleRightTrigger() {
    this.moveContainer(VELOCITY_RIGHT);
  }

  render() {
    const { className, children } = this.props;

    if (this.state.triggerRecalc) {
      this.setState({
        triggerRecalc: false,
      }, () => {
        this.handleZoneSizesChange();
      });
    }

    return (
      <div className={classnames(className, 'm-horizontal-scroll')}>
        { this.state.hasNavigationSliders && (
          <NavbarItem>
            <Button onClick={this.handleLeftTrigger} className="m-horizontal-scroll__anchor">
              <Icon type="arrow-left" />
            </Button>
          </NavbarItem>
        )}
        <div className="m-horizontal-scroll__visible-zone" ref={this.setRef('visibleZone')}>
          <div className="m-menu m-horizontal-scroll__container" ref={this.setRef('container')}>
            {children}
          </div>
        </div>
        {this.state.hasNavigationSliders && (
          <NavbarItem>
            <Button onClick={this.handleRightTrigger} className="m-horizontal-scroll__anchor">
              <Icon type="arrow-right" />
            </Button>
          </NavbarItem>
        )}
      </div>
    );
  }
}

HorizontalScroll.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  subscribedState: PropTypes.shape({}).isRequired,
};

HorizontalScroll.defaultProps = {
  className: undefined,
};

export default HorizontalScroll;
