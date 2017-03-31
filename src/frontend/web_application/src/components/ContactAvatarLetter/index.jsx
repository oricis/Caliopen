import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ContactIconLetter from '../ContactIconLetter';
import './style.scss';

export const SIZE_SMALL = 'small';
export const SIZE_MEDIUM = 'medium';
export const SIZE_LARGE = 'large';
export const SIZE_XLARGE = 'xlarge';

const ContactAvatarLetter = ({ contact, className, size, isRound }) => {
  const ClassNameShape = classnames(
      'm-avatar--round': isRound,
  );

  const classNameModifiers = {
    [SIZE_SMALL]: 'm-avatar--small',
    [SIZE_MEDIUM]: 'm-avatar--medium',
    [SIZE_LARGE]: 'm-avatar--large',
    [SIZE_XLARGE]: 'm-avatar--xlarge',
  };
  const classNameSize = Object.keys(classNameModifiers).reduce((prev, key) => {
    if (!prev && key === size) {
      return classNameModifiers[key];
    }

    return prev;
  }, undefined);

  const letterClassNameSize = classNameSize ? `${classNameSize}__letter` : null;

  const letterClassName = className ? `${className}__letter` : null;

  return (
    <div className={classnames('m-avatar', className, classNameSize, ClassNameShape)}>
      <ContactIconLetter
        className={classnames('m-avatar__letter', letterClassName, letterClassNameSize)}
        contact={contact}
      />
    </div>
  );
};

ContactAvatarLetter.propTypes = {
  contact: PropTypes.shape({}),
  size: PropTypes.string,
  isRound: PropTypes.bool,
  className: PropTypes.string,
};

export default ContactAvatarLetter;
