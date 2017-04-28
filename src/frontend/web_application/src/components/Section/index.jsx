import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Title from '../../components/Title';
import './style.scss';

const Section = ({ className, title, descr, hasSeparator = true, children }) => (
  <section className={classnames('m-section', { 'm-section--separator': hasSeparator }, className)}>
    {(title || descr) &&
      <header className="m-section__header">
        <Title className="m-section__title">{title}</Title>
        <p className="m-section__descr">{descr}</p>
      </header>
    }

    {children}
  </section>
);

Section.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  descr: PropTypes.string,
  hasSeparator: PropTypes.bool,
  children: PropTypes.node,
};

export default Section;
