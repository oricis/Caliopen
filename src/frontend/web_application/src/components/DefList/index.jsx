import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

const DefList = ({ className, children = [] }) => {
  const nodes = children.reduce((prev, definition) => {
    prev.push(<dt className="m-def-list__title" key={prev.length + 1}>{definition.title}</dt>);
    definition.descriptions.forEach((description) => {
      prev.push(<dd className="m-def-list__def" key={prev.length + 1}>{description}</dd>);
    });

    return prev;
  }, []);

  return (
    <dl className={classnames('m-def-list', className)}>
      {nodes}
    </dl>
  );
};

DefList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.shape({})),
};

export default DefList;
