import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Title from '../../components/Title';

import './style.scss';

const Section = ({ className, title, descr, children }) => {


  return (
    <section className={classnames('m-section', className)}>
      {(title || descr) &&
        <header className="m-section__header">
          <Title className="m-section__title">{title}</Title>
          <p className="m-section__descr">{descr}</p>
        </header>
      }

      {children}
    </section>
  );
};

Section.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  descr: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Section;
