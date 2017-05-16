import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ItemContent from './components/ItemContent';
import './style.scss';

const TextList = ({ className, ...props }) => (
  <ul className={classnames('m-text-list', className)} {...props} />
);

TextList.propTypes = {
  className: PropTypes.string,
};
TextList.defaultProps = {
  className: undefined,
};

export { ItemContent };

export default TextList;
