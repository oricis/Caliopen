import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classnames from 'classnames';
import Button from '../Button';
import './style.scss';

const Modal = ({ className, title, children, onClose, ...props }) => (
  <ReactModal
    className={classnames('m-modal', className)}
    overlayClassName="m-modal__overlay"
    {...props}
  >
    <header className="m-modal__header">
      {title && (
        <div className="m-modal__title">{title}</div>
      )}
      <Button className="m-modal__close" onClick={onClose} icon="remove" />
    </header>
    <div className="m-modal__content">
      {children}
    </div>
  </ReactModal>
);

Modal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.node,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  className: undefined,
  title: undefined,
  children: undefined,
  onClose: () => {},
};

export default Modal;
