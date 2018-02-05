import { Component } from 'react';
import PropTypes from 'prop-types';

class BodyClass extends Component {
  /*
    this allows to switch body classNames
    see styles/base/body.scss to add/edit body classes
  */
  static propTypes = {
    backgroundColorClass: PropTypes.oneOf(['white']).isRequired,
    children: PropTypes.node.isRequired,
  }
  static defaultProps = {}

  componentDidMount() {
    const { backgroundColorClass } = this.props;
    document.body.classList.toggle(backgroundColorClass, backgroundColorClass);
  }
  componentWillReceiveProps(nextProps) {
    document.body.classList.toggle(this.props.backgroundColorClass, nextProps.backgroundColorClass);
  }
  componentWillUnmount() {
    document.body.classList.remove(this.props.backgroundColorClass);
  }
  render() {
    return this.props.children;
  }
}

export default BodyClass;
