import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import classnames from 'classnames';
import { WithTags, getTagLabelFromName } from '../../../../modules/tags';
import Button from '../../../../components/Button';
import NavList, { ItemContent } from '../../../../components/NavList';

import './style.scss';

function nbContactsbyTag(list, tag) {
/* *
 * Count the number of time `tag` appears in `list` (array of all tags from all contacts)
 * (= number of contacts tagged with `tag`)
 * @param Array(<string>) list
 * @param <string> tag
 * @return <number>
 * */
  const count = [];
  list.map(item => item === tag && count.push(item));

  return count.length;
}

@withI18n()
class TagList extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onTagClick: PropTypes.func.isRequired,
    activeTag: PropTypes.string.isRequired,
    nbContactsAll: PropTypes.number.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
  };
  state = {};

  renderItem({ tagName, title, nbContacts }) {
    const { activeTag, onTagClick } = this.props;
    const tagClassName = classnames(
      'm-tag-list__tag',
      {
        'm-tag-list__tag--active': activeTag === tagName,
      }
    );

    return (
      <Button onClick={onTagClick} className={tagClassName}>{title} ({nbContacts})</Button>
    );
  }

  render() {
    const { tags, nbContactsAll, i18n } = this.props;
    const list = tags.sort((a, b) => a.localeCompare(b));
    const tagList = Array.from(new Set(list));

    return (
      <NavList className="m-tag-list" dir="vertical">
        <ItemContent className="m-tag-list__item">
          {this.renderItem({
            tagName: '',
            title: i18n._('tag_list.all_contacts', { defaults: 'All contacts' }),
            nbContacts: nbContactsAll,
          })}
        </ItemContent>
        <WithTags render={userTags => tagList.map(
          name => (
            <ItemContent className="m-tag-list__item" key={name}>
              {this.renderItem({
                tagName: name,
                title: getTagLabelFromName(i18n, userTags, name),
                nbContacts: nbContactsbyTag(list, name),
              })}
            </ItemContent>
          ))}
        />
      </NavList>
    );
  }
}

export default TagList;
