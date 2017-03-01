import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import Link from '../../../../components/Link';
import NavList, { ItemContent } from '../../../../components/NavList';

import './style.scss';

function nbContactsbyTag(list, tag) {
  /**
 * Count the number of time `tag` appears in `list` (array of all tags from all contacts)
 * (= number of contacts tagged with `tag`)
 * @param Array(<string>) list
 * @param <string> tag
 * @return <number>
 **/
  const count = [];
  list.map(item => item === tag && count.push(item));

  return count.length;
}

const TagItem = ({ title, link, onTagClick, nbContacts, active, className }) => (
  <ItemContent className="m-tag-list__item">
    <Link
      noDecoration
      expanded
      onClick={onTagClick}
      id={link}
      className={className}
      active={active}
    >
      {title} ({nbContacts})
    </Link>
  </ItemContent>
);

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

const TagList = ({ tags, onTagClick, nbContactsAll, activeTag }) => {
  const list = tags.sort((a, b) => a.localeCompare(b));
  const tagList = Array.from(new Set(list));

  return (
    <div>
      <NavList className="m-tag-list" dir="vertical">
        <TagItem
          title="All contacts"
          link=""
          nbContacts={nbContactsAll}
          key={uuidV1()}
          onTagClick={onTagClick}
          active={activeTag === '' && true}
          className="m-tag-list__link m-tag-list__link--all"
        />
        {tagList.map(tag =>
          <TagItem
            title={tag}
            link={tag}
            nbContacts={nbContactsbyTag(list, tag)}
            key={uuidV1()}
            onTagClick={onTagClick}
            active={tag === activeTag && true}
            className="m-tag-list__link"
          />
        )}
      </NavList>
    </div>
  );
};

TagList.propTypes = {
  tags: PropTypes.node.isRequired,
  onTagClick: PropTypes.func.isRequired,
  activeTag: PropTypes.string.isRequired,
  nbContactsAll: PropTypes.number.isRequired,
};
export default TagList;
