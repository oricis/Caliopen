import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../Button';

class File extends PureComponent {
  static propTypes = {
    onRemove: PropTypes.func.isRequired,
    file: PropTypes.shape({}).isRequired,
    __: PropTypes.func.isRequired,
    formatNumber: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  render() {
    const { file, onRemove, __, formatNumber } = this.props;

    return (
      <div className="m-input-file-group__file">
        <Button
          className="m-input-file-group__file__remove"
          icon="remove"
          value={file}
          onClick={onRemove}
          shape="plain"
        />
        <span className="m-input-file-group__file__name">{file.name}</span>
        <span className="m-input-file-group__file__size">{ __('input-file-group.file.size', { size: formatNumber(Math.round(file.size / 100) / 10) }) }</span>
      </div>
    );
  }
}

export default File;
