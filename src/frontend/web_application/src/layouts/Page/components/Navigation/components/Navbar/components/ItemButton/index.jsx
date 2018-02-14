import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from '../../../../../../../../components/';
import './style.scss';

const ItemButton = ({ className, ...props }) => {
  const buttonProps = {
    ...props,
    className: classnames('m-item-button', className),
  };

  return (
    <Button {...buttonProps} />
  );
};

ItemButton.propTypes = {
  className: PropTypes.string,
};

ItemButton.defaultProps = {
  className: null,
};

export default ItemButton;
