import React, { PropTypes } from 'react';
import { v1 as uuidv1 } from 'uuid';
import './style.scss';

const DiscussionDraft = ({ body, onChange, __ }) => {
  const id = uuidv1();

  return (
    <div className="m-discussion-textarea">
      <label htmlFor={id} className="sr-only">{__('messages.compose.form.body.label')}</label>
      <textarea
        id={id}
        name="body"
        className="m-discussion-textarea__body"
        onChange={onChange}
        placeholder={__('messages.compose.form.body.placeholder')}
        value={body}
      />
    </div>
  );
};

DiscussionDraft.propTypes = {
  body: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  __: PropTypes.func.isRequired,
};
DiscussionDraft.defaultProps = {
  body: '',
};

export default DiscussionDraft;
