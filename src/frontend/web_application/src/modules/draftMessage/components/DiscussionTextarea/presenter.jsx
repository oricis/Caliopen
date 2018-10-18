import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { v1 as uuidv1 } from 'uuid';
import './style.scss';

const DiscussionTextarea = ({ body, onChange, i18n }) => {
  const id = uuidv1();

  return (
    <div className="m-discussion-textarea">
      <label htmlFor={id} className="sr-only"><Trans id="messages.compose.form.body.label">Type your message here...</Trans></label>
      <textarea
        id={id}
        name="body"
        className="m-discussion-textarea__body"
        onChange={onChange}
        placeholder={i18n._('messages.compose.form.body.placeholder', null, { defaults: 'Type your message here...' })}
        value={body}
      />
    </div>
  );
};

DiscussionTextarea.propTypes = {
  body: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({}).isRequired,
};
DiscussionTextarea.defaultProps = {
  body: '',
};

export default DiscussionTextarea;
