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
  componentInline: {
    display: 'inline-block',
    height: 'auto',
  },
};

const ComponentWrapper = ({ tall, inline, children }) => {
  let componentStyle = { ...style.component };

  if (tall) {
    componentStyle = { ...componentStyle, ...style.componentTall };
  }

  if (inline) {
    componentStyle = { ...componentStyle, ...style.componentInline };
  }

  return (
    <div style={componentStyle}>{children}</div>
  );
};

ComponentWrapper.propTypes = {
  tall: PropTypes.bool,
  inline: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ComponentWrapper;
