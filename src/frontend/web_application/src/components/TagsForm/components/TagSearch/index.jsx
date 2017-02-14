import React, { Component, PropTypes } from 'react';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { TextFieldGroup } from '../../../form';

import './style.scss';

class TagSearch extends Component {
  static propTypes = {
    __: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }


  handleClick() {
    this.setState(prevState => ({
      edit: !prevState.edit,
    }));
  }


  render() {
    const { __ } = this.props;

    return (
      <div className="m-tags-search">
        <TextFieldGroup
          id="tags-search"
          name="tags-search"
          className="m-tags-search__input"
          label={__('tags.form.search.label')}
          placeholder={__('tags.form.search.placeholder')}
          onChange={this.handleInputChange}
          showLabelforSr
        />
        <Button inline onClick={this.handleSubmit}><Icon type="search" /></Button>
      </div>
    );
  }
}

export default TagSearch;
