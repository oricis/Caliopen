import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ContactIconLetter from '../ContactIconLetter';
import './style.scss';

export const SIZE_SMALL = 'small';
export const SIZE_MEDIUM = 'medium';
export const SIZE_LARGE = 'large';
export const SIZE_XLARGE = 'xlarge';
export const SIZE_XXLARGE = 'xxlarge';

const ContactAvatarLetter = ({ contact, className, size, isRound }) => {
  const ClassNameShape = classnames(
      'm-avatar--round': isRound,
  );

  const classNameModifiers = {
    [SIZE_SMALL]: 'm-avatar--small',
    [SIZE_MEDIUM]: 'm-avatar--medium',
    [SIZE_LARGE]: 'm-avatar--large',
    [SIZE_XLARGE]: 'm-avatar--xlarge',
    [SIZE_XXLARGE]: 'm-avatar--xxlarge',
  };
  const classNameSize = classNameModifiers[size];
  const letterClassNameSize = classNameSize ? `${classNameSize}__letter` : null;

  return (
    <div className={classnames('m-avatar', className, classNameSize, ClassNameShape)}>
      <ContactIconLetter
        className={classnames('m-avatar__letter', letterClassNameSize)}
        contact={contact}
      />
    </div>
  );
};

ContactAvatarLetter.propTypes = {
  contact: PropTypes.shape({}),
  size: PropTypes.oneOf([SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE, SIZE_XXLARGE]),
  isRound: PropTypes.bool,
  className: PropTypes.string,
};
ContactAvatarLetter.defaultProps = {
  contact: undefined,
  size: undefined,
  isRound: false,
  className: undefined,
};

export default ContactAvatarLetter;
