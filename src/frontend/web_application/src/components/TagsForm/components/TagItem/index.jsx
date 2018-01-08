import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import Button from '../../../Button';
import Spinner from '../../../Spinner';
import { getTagLabel } from '../../../../modules/tags';

import './style.scss';

@withI18n()
class TagItem extends Component {
  static propTypes = {
    tag: PropTypes.shape({}).isRequired,
    onDelete: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  state = {
    isTagCollectionUpdating: false,
  };

  handleDeleteTag = async () => {
    const { onDelete, tag } = this.props;

    this.setState({ isTagCollectionUpdating: true });
    await onDelete({ tag });
    this.setState({ isTagCollectionUpdating: false });
  };

  render() {
    const { tag, i18n } = this.props;

    return (
      <div className="m-tag">
        <span className="m-tag__text">{getTagLabel(i18n, tag)}</span>
        <Button
          className="m-tag__button"
          display="inline-block"
          onClick={this.handleDeleteTag}
          icon={this.state.isTagCollectionUpdating ? (<Spinner isLoading display="inline" />) : 'remove'}
          aria-label={i18n._('tags.action.remove', { defaults: 'Remove' })}
        />
      </div>
    );
  }
}

export default TagItem;
