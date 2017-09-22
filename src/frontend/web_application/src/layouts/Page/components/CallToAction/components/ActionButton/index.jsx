import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tappable from 'react-tappable/lib/Tappable';
import Button from '../../../../../../components/Button';

class ActionButton extends PureComponent {
  static propTypes = {
    action: PropTypes.func.isRequired,
    button: PropTypes.shape({}),
    children: PropTypes.node,
  };
  static defaultProps = {
    button: {},
    children: null,
  };

  render() {
    const { action, button, children } = this.props;
    const tappableProps = {
      onTap: () => action(),
      // noop to prevent tap on hold
      // this allow parent to get focus
      onPress: () => {},
    };

    return (
      <Tappable {...tappableProps}>
        <Button {...button} shape="plain" responsive="icon-only">{children}</Button>
      </Tappable>
    );
  }
}

export default ActionButton;
