import React, { PropTypes } from 'react';
import ItemContent from './components/ItemContent';
import './style.scss';

const BlockList = ({ children }) => (
  <ul className="m-block-list">
    {
      children.map((comp, key) => (
        <li className="m-block-list__item" key={key}>{comp}</li>
      ))
    }
  </ul>
);

BlockList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export { ItemContent };
export default BlockList;
