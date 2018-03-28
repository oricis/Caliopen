import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import { Button, Spinner, Badge } from '../../../../components';
import { getTagLabel } from '../../';

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
      <Badge className="m-tag-item">
        <span className="m-tag-item__text">{getTagLabel(i18n, tag)}</span>
        <Button
          className="m-tag-item__button"
          display="inline"
          onClick={this.handleDeleteTag}
          icon={this.state.isTagCollectionUpdating ? (<Spinner isLoading display="inline" />) : 'remove'}
          aria-label={i18n._('tags.action.remove', { defaults: 'Remove' })}
        />
      </Badge>
    );
  }
}

export default TagItem;
