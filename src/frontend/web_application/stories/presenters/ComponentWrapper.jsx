import React, { PropTypes } from 'react';

const style = {
  component: {
    margin: '1rem',
    border: '1px solid blue',
    height: '5rem',
  },
  componentTall: {
    height: '15rem',
  },
};

const ComponentWrapper = ({ tall, children }) => {
  let componentStyle = { ...style.component };

  if (tall) {
    componentStyle = { ...componentStyle, ...style.componentTall };
  }

  return (
    <div style={componentStyle}>{children}</div>
  );
};

ComponentWrapper.propTypes = {
  tall: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ComponentWrapper;
