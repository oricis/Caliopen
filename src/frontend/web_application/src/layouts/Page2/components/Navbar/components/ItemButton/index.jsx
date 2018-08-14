import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from '../../../../../../components/';
import './style.scss';

class ItemButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };
  static defaultProps = {
    className: undefined,
  };

  render() {
    const { className, ...props } = this.props;

    return (
      <Button className={classnames(className, 'm-item-button')} {...props} />
    );
  }
}

export default ItemButton;
