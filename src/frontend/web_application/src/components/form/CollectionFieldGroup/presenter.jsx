import React, { PropTypes } from 'react';
import DeleteFieldGroup from './components/DeleteFieldGroup';
import AddFieldGroup from './components/AddFieldGroup';
import './style.scss';

const CollectionFieldGroup = ({ collection, addLabel, itemLabel, onChange, validate, __ }) => {
  const handleAdd = (item) => {
    onChange([item, ...collection]);
  };

  const handleDelete = (deletedItem) => {
    onChange(collection.filter(item => item !== deletedItem));
  };

  return (
    <div className="m-collection-field-group">
      <AddFieldGroup label={addLabel} onAdd={handleAdd} validate={validate} __={__} />
      {collection.map((item, key) => (
        <DeleteFieldGroup
          key={key}
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
  collection: PropTypes.arrayOf(PropTypes.string).isRequired,
  addLabel: PropTypes.string.isRequired,
  itemLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.func,
  __: PropTypes.func.isRequired,
};

export default CollectionFieldGroup;
