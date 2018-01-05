import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import Button from '../../../Button';
import { TextFieldGroup } from '../../../form';

import './style.scss';

@withI18n()
class TagSearch extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    onChange: null,
  };

  state = {
    terms: '',
  };

  handleChange = (ev) => {
    const terms = ev.target.value;
    this.setState({ terms });
    if (this.props.onChange) {
      this.props.onChange({ terms });
    }
  }

  handleSubmit = () => {
    if (this.state.terms.length === 0) {
      return;
    }

    this.setState((prevState) => {
      this.props.onSubmit({ tag: prevState.terms });

      return {
        terms: '',
      };
    });
  }

  render() {
    const { i18n } = this.props;

    return (
      <div className="m-tags-search">
        <TextFieldGroup
          id="tags-search"
          name="terms"
          value={this.state.terms}
          className="m-tags-search__input"
          label={i18n._('tags.form.search.label', { defaults: 'Search' })}
          placeholder={i18n._('tags.form.search.placeholder', { defaults: 'Search a tag ...' })}
          onChange={this.handleChange}
          showLabelforSr
        />
        <Button className="m-tags-search__button" icon="search" onClick={this.handleSubmit} />
      </div>
    );
  }
}

export default TagSearch;
