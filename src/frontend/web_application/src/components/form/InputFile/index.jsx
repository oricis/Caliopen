import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import { FieldErrors } from '../';
import Button from '../../Button';
import Icon from '../../Icon';

import './style.scss';

const InputFile = ({ onChange, className, accept, errors, __ }) => {
  const id = uuidV1();

  return (
    <div className={classnames('m-input-file', className)}>
      <label htmlFor={id} className="m-input-file__label">
        <Button className="m-input-file__label__button" icon="plus" shape="plain" />
        <span className="m-input-file__label__text">{__('input-file.add_a_file.label')}</span>
        <span className="m-input-file__label__icon"><Icon type="folder" /></span>
        <input
          id={id}
          type="file"
          name="files"
          className="m-input-file__input"
          onChange={onChange}
          accept={accept}
          // multiple={multiple}
        />
      </label>
      { errors.length > 0 && <FieldErrors errors={errors} /> }
    </div>
  );
};

InputFile.propTypes = {
  __: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  // multiple: PropTypes.bool, multiple is disabled
  accept: PropTypes.arrayOf(PropTypes.string).isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

InputFile.defaultProps = {
  className: null,
  errors: null,
  // multiple: false,
};

export default InputFile;
