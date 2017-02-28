import React, { PropTypes, Component } from 'react';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { TextFieldGroup } from '../../../form';

import './style.scss';

class TagSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagSearch: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(ev) {
    this.setState({
      tagsSearch: ev.target.value,
    });
  }

  handleSubmit() {
    if (this.state.tagSearch.length === 0) {
      return;
    }

    this.setState((prevState) => {
      this.props.onSubmit({ tag: prevState.tagSearch });

      return {
        tagSearch: '',
      };
    });
  }

  render() {
    const { __ } = this.props;

    return (
      <div className="m-tags-search">
        <TextFieldGroup
          id="tags-search"
          name="tagsSearch"
          value={this.state.tagsSearch}
          className="m-tags-search__input"
          label={__('tags.form.search.label')}
          placeholder={__('tags.form.search.placeholder')}
          onChange={this.handleChange}
          showLabelforSr
        />
        <Button inline onClick={this.handleSubmit}><Icon type="search" /></Button>
      </div>
    );
  }
}

TagSearch.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  __: PropTypes.func,
};

export default TagSearch;
