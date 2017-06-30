import React from 'react';
import PropTypes from 'prop-types';
import TagsForm from '../../../components/TagsForm';

const ManageTags = ({ contact, onContactChange }) => {
  const handleTagsChange = ({ tags }) => {
    const updateContact = {
      ...contact,
      tags,
    };

    onContactChange({ contact: updateContact, original: contact });
  };

  return (
    <TagsForm tags={contact.tags} onChange={handleTagsChange} />
  );
};

ManageTags.propTypes = {
  contact: PropTypes.shape({}).isRequired,
  onContactChange: PropTypes.func.isRequired,
};

export default ManageTags;
