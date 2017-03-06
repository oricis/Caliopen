import React, { PropTypes } from 'react';
import DeleteFieldGroup from './components/DeleteFieldGroup';
import AddFieldGroup from './components/AddFieldGroup';
import './style.scss';

const CollectionFieldGroup = ({
  collection, addTemplate, editTemplate, onChange, __,
}) => {
  const handleAdd = ({ item }) => {
    onChange([item, ...collection]);
  };

  const handleChangeItem = ({ item, position }) => {
    const newCollection = [...collection];
    newCollection[position] = item;

    onChange(newCollection);
  };

  const handleDelete = ({ item: deletedItem }) => {
    onChange(collection.filter(item => item !== deletedItem));
  };

  return (
    <div className="m-collection-field-group">
      <AddFieldGroup template={addTemplate} onAdd={handleAdd} __={__} />
      {collection.map((item, key) => (
        <DeleteFieldGroup
          key={key}
          position={key}
          item={item}
          template={editTemplate}
          onChange={handleChangeItem}
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
  addTemplate: PropTypes.element.isRequired,
  editTemplate: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
};

export default CollectionFieldGroup;
