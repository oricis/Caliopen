import React, { PropTypes } from 'react';
import classnames from 'classnames';
import getClassName from './services/stylesheet-helper';
import './style.scss';

const IconLetter = ({ word, className }) => (
  <span className={classnames(className, getClassName(word))} />
);

IconLetter.propTypes = {
  word: PropTypes.string,
  className: PropTypes.string,
};

IconLetter.defaultProps = {
  word: null,
  className: null,
};

export default IconLetter;
