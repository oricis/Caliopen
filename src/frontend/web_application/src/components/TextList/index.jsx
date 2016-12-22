import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ItemContent from './components/ItemContent';
import './style.scss';

const TextList = ({ className, ...props }) => (
  <ul className={classnames('m-text-list', className)} {...props} />
);

TextList.propTypes = {
  className: PropTypes.string,
};

export { ItemContent };

export default TextList;
