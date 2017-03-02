import React, { PropTypes } from 'react';
import DeleteFieldGroup from './components/DeleteFieldGroup';
import AddFieldGroup from './components/AddFieldGroup';
import './style.scss';

const CollectionFieldGroup = ({ collection, addLabel, itemLabel, onChange, __ }) => {
  const handleAdd = (item) => {
    onChange([item, ...collection]);
  };

  const handleDelete = (deletedItem) => {
    onChange(collection.filter(item => item !== deletedItem));
  };

  return (
    <div className="m-collection-field-group">
      <AddFieldGroup label={addLabel} onAdd={handleAdd} __={__} />
      {collection.map(item => (
        <DeleteFieldGroup
          key={itemLabel}
          item={item}
          label={itemLabel}
          onDelete={handleDelete}
          __={__}
          className="m-collection-field-group__delete-group"
        />
      ))}
    </div>
  );
};

CollectionFieldGroup.propTypes = {
  collection: PropTypes.arrayOf(PropTypes.string),
  addLabel: PropTypes.string,
  itemLabel: PropTypes.string,
  onChange: PropTypes.func,
  __: PropTypes.func,
};

export default CollectionFieldGroup;
