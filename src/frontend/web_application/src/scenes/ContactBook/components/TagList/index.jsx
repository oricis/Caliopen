import React, { PropTypes } from 'react';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import Button from '../../../../components/Button';
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

const TagItem = ({ title, link, onTagClick, nbContacts, active, all, className }) => {
  const tagClassName = classnames(
    className,
    'm-tag-list__tag',
    {
      'm-tag-list__tag--active': active,
      'm-tag-list__tag--all': all,
    }
  );

  return (
    <ItemContent className="m-tag-list__item">
      <Button
        expanded
        onClick={onTagClick}
        value={link}
        className={tagClassName}
        active={active}
      >
        {title} ({nbContacts})
      </Button>
    </ItemContent>
  );
};

TagItem.propTypes = {
  all: PropTypes.bool.isRequired,
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
          all
        />
        {tagList.map(tag =>
          <TagItem
            title={tag}
            link={tag}
            nbContacts={nbContactsbyTag(list, tag)}
            key={uuidV1()}
            onTagClick={onTagClick}
            active={tag === activeTag && true}
            all={false}
          />
        )}
      </NavList>
    </div>
  );
};

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTagClick: PropTypes.func.isRequired,
  activeTag: PropTypes.string.isRequired,
  nbContactsAll: PropTypes.number.isRequired,
};
export default TagList;
