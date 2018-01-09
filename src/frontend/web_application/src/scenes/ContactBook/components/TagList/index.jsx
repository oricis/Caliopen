import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withI18n } from 'lingui-react';
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

const TagItem = ({ title, link, onTagClick, nbContacts, active, className }) => {
  const tagClassName = classnames(
    className,
    'm-tag-list__tag',
    {
      'm-tag-list__tag--active': active,
    }
  );


  return (
    <ItemContent className="m-tag-list__item">
      <Button
        onClick={onTagClick}
        value={link}
        className={tagClassName}
      >
        {title} ({nbContacts})
      </Button>
    </ItemContent>
  );
};

TagItem.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  nbContacts: PropTypes.number.isRequired,
  onTagClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
};

TagItem.defaultProps = {
  active: false,
  className: '',
};

const TagList = ({ tags, onTagClick, nbContactsAll, activeTag, i18n }) => {
  const list = tags.sort((a, b) => a.localeCompare(b));
  const tagList = Array.from(new Set(list));

  return (
    <NavList className="m-tag-list" dir="vertical">
      <TagItem
        title={i18n._('tag_list.all_contacts', { defaults: 'All contacts' })}
        link=""
        nbContacts={nbContactsAll}
        onTagClick={onTagClick}
        active={activeTag === ''}
      />
      <WithTags render={userTags => tagList.map(
        name => (
          <TagItem
            title={getTagLabelFromName(i18n, userTags, name)}
            link={name}
            nbContacts={nbContactsbyTag(list, name)}
            key={name}
            onTagClick={onTagClick}
            active={name === activeTag}
          />
        ))}
      />
    </NavList>
  );
};

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTagClick: PropTypes.func.isRequired,
  activeTag: PropTypes.string.isRequired,
  nbContactsAll: PropTypes.number.isRequired,
  i18n: PropTypes.shape({}).isRequired,
};
export default withI18n()(TagList);
