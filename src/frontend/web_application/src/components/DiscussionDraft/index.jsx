import React from 'react';

export const TopRow = props => (
  <div className="m-discussion-draft__top-row" {...props} />
);

export const BodyRow = props => (
  <div className="m-discussion-draft__body-row" {...props} />
);

const DiscussionDraft = props => (
  <div className="m-discussion-draft" {...props} />
);
export default DiscussionDraft;
