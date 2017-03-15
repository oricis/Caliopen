import React, { PropTypes } from 'react';
import classnames from 'classnames';

export const Raw = ({ children, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

Raw.propTypes = {
  children: PropTypes.node.isRequired,
};


const Presenter = ({ className, flat, ...props }) => {
  const DropdownClassName = classnames(
    'm-dropdown',
    {
      'm-dropdown--flat': flat,
    },
    className
  );

  const presenterProps = {
    ...props,
    className: classnames('m-dropdown', DropdownClassName),
  };

  return (
    <Raw {...presenterProps} />
  );
};

Presenter.propTypes = {
  className: PropTypes.string,
  flat: PropTypes.bool,
};

export default Presenter;
