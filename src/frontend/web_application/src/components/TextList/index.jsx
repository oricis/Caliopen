import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TextItem from './components/TextItem';
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

export { TextItem };

export default TextList;
