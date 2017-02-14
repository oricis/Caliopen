import React, { PropTypes } from 'react';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { TextFieldGroup } from '../../../form';

import './style.scss';

const TagSearch = ({ __ }) => {
  const noop = str => str;

  return (
    <div className="m-tags-search">
      <TextFieldGroup
        id="tags-search"
        name="tags-search"
        className="m-tags-search__input"
        label={__('tags.form.search.label')}
        placeholder={__('tags.form.search.placeholder')}
        showLabelforSr
      />
      <Button inline onClick={noop}><Icon type="search" /></Button>
    </div>
  );
};

TagSearch.propTypes = {
  __: PropTypes.func,
};

export default TagSearch;
