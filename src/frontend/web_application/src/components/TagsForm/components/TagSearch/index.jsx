import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import Button from '../../../Button';
import Spinner from '../../../Spinner';
import { TextFieldGroup } from '../../../form';

import './style.scss';

@withI18n()
class TagSearch extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    i18n: PropTypes.shape({}).isRequired,
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    onChange: () => {},
    isFetching: false,
  };

  state = {
    terms: '',
  };

  handleChange = (ev) => {
    const terms = ev.target.value;
    this.setState({ terms });
    this.props.onChange(terms);
  }

  handleSubmit = () => {
    if (this.state.terms.length === 0) {
      return;
    }

    this.setState((prevState) => {
      this.props.onSubmit(prevState.terms);

      return {
        terms: '',
      };
    });
  }

  render() {
    const { i18n, isFetching } = this.props;

    return (
      <div className="m-tags-search">
        <TextFieldGroup
          id="tags-search"
          name="terms"
          value={this.state.terms}
          className="m-tags-search__input"
          label={i18n._('tags.form.search.label')}
          placeholder={i18n._('tags.form.search.placeholder')}
          onChange={this.handleChange}
          showLabelforSr
        />
        <Button
          className="m-tags-search__button"
          icon={isFetching ? (<Spinner isLoading display="inline" />) : 'plus'}
          onClick={this.handleSubmit}
        />
      </div>
    );
  }
}

export default TagSearch;
