import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

export const typeAssoc = {
  at: 'fa fa-at',
  'angle-down': 'fa fa-angle-down',
  calendar: 'fa fa-calendar',
  'caret-up': 'fa fa-caret-up',
  'caret-down': 'fa fa-caret-down',
  check: 'fa fa-check',
  comment: 'fa fa-comment',
  comments: 'fa fa-comments',
  'comments-o': 'fa fa-comments-o',
  edit: 'fa fa-edit',
  envelope: 'fa fa-envelope',
  'ellipsis-v': 'fa fa-ellipsis-v',
  email: 'fa fa-envelope',
  'exclamation-triangle': 'fa fa-exclamation-triangle',
  'info-circle': 'fa fa-info-circle',
  key: 'fa fa-key',
  laptop: 'fa fa-laptop',
  lock: 'fa fa-lock',
  'map-marker': 'fa fa-map-marker',
  paperclip: 'fa fa-paperclip',
  plug: 'fa fa-plug',
  plus: 'fa fa-plus',
  phone: 'fa fa-phone',
  remove: 'fa fa-remove',
  reply: 'fa fa-reply',
  search: 'fa fa-search',
  server: 'fa fa-server',
  share: 'fa fa-share',
  shield: 'fa fa-shield',
  user: 'fa fa-user',
  users: 'fa fa-users',
  tags: 'fa fa-tags',
  'th-large': 'fa fa-th-large',
  trash: 'fa fa-trash',
  'window-maximize': 'fa fa-window-maximize',
};


const Icon = ({ className, type, spaced, ...props }) => {
  // eslint-disable-next-line no-console
  const typeClassName = typeAssoc[type] || console.error(`The type "${type}" is not a valid Icon component type`);
  const iconProps = {
    ...props,
    className: classnames(
      className,
      typeClassName,
      { 'm-icon--spaced': spaced }
    ),
  };

  return <i {...iconProps} />;
};

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  spaced: PropTypes.bool,
};

export default Icon;
