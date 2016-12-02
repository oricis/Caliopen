import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

const TextBlock = ({ inline, className, ...props }) => (
  <span
    className={classnames('m-text-block', { 'm-text-block--inline': inline }, className)}
    {...props}
  />
);

TextBlock.propTypes = {
  inline: PropTypes.bool,
  className: PropTypes.string,
};

export default TextBlock;
