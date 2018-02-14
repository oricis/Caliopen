import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

export const Legend = ({ className, ...props }) => (
  <legend className={classnames('m-fieldset__legend', className)} {...props} />
);
Legend.propTypes = {
  className: PropTypes.string,
};

const Fieldset = ({ className, ...props }) => (
  <fieldset className={classnames('m-fieldset', className)} {...props} />
);

Fieldset.propTypes = {
  className: PropTypes.string,
};

export default Fieldset;
