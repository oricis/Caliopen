import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { TextFieldGroup } from '../../../';
import Button from '../../../../Button';
import Icon from '../../../../Icon';
import './style.scss';

const DeleteFieldGroup = ({ label, item, onDelete, className }) => {
  const handleDelete = () => {
    onDelete(item);
  };

  return (
    <div className={classnames('m-delete-field-group', className)}>
      <TextFieldGroup
        label={label}
        name={item}
        value={item}
        className="m-delete-field-group__input"
        showLabelforSr
        readOnly
      />
      <Button
        onClick={handleDelete}
        plain
        inline
        className="m-delete-field-group__button"
      ><Icon type="remove" /></Button>
    </div>
  );
};

DeleteFieldGroup.propTypes = {
  label: PropTypes.string,
  item: PropTypes.string,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

export default DeleteFieldGroup;
