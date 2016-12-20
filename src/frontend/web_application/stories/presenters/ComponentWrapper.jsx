import React, { PropTypes } from 'react';

const style = {
  component: {
    margin: '1rem',
    border: '1px solid blue',
    height: '5rem',
  },
};

const ComponentWrapper = ({ children }) => (
  <div style={style.component}>{children}</div>
);

ComponentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ComponentWrapper;
