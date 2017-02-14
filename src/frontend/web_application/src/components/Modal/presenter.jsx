import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import './style.scss';

const Modal = ({ className, title, children }) => (
  <section className={classnames('m-modal', className)}>
    <header className="m-modal__header">
      {title &&
      <div className="m-modal__title">{title}</div>
      }
      <Button inline className="m-modal__close"><Icon type="remove" /></Button>
    </header>
    <div className="m-modal__content">
      {children}
    </div>
  </section>
);

Modal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.node,
};

export default Modal;
