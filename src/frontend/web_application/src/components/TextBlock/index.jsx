import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

const TextBlock = ({ inline, size, weight, className, ...props }) => {
  const textBlockClassName = classnames(
    'm-text-block',
    {
      'm-text-block--inline': inline,
      'm-text-block--small': size === 'small',
      'm-text-block--strong': weight === 'strong',
    },
    className
  );

  return (
    <span className={textBlockClassName} {...props} />
  );
};

TextBlock.propTypes = {
  inline: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.string,
  weight: PropTypes.string,

};

export default TextBlock;
