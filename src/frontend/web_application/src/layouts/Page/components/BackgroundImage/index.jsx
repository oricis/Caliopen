import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';

class BackgroundImage extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    context: PropTypes.string.isRequired,
  };

  render() {
    const { context, children } = this.props;

    return React.Children.map(children, (C) => {
      const childProps = {
        ...C.props,
        className: classnames(
          C.props.className,
          'm-background-image',
          {
            'm-background-image--secure': context === 'secure',
            // 'm-background-image--public': context === 'public',
          }
        ),
      };

      return (
        <C.type {...childProps} />
      );
    });
  }
}

export default BackgroundImage;
