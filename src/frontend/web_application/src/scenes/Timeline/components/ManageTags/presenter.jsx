import React from 'react';
import PropTypes from 'prop-types';
import TagsForm from '../../../../components/TagsForm';

const ManageTags = ({ message, onMessageChange }) => {
  const handleTagsChange = ({ tags }) => {
    const updateMessage = {
      ...message,
      tags,
    };

    onMessageChange({ message: updateMessage, original: message });
  };

  return (
    <TagsForm
      tags={message.tags && message.tags}
      onUpdate={handleTagsChange}
      onCreate={str => str}
    />
  );
};

ManageTags.propTypes = {
  message: PropTypes.shape({}).isRequired,
  onMessageChange: PropTypes.func.isRequired,
};

export default ManageTags;
