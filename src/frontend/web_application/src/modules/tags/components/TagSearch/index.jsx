import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import { TextFieldGroup, Button, Spinner } from '../../../../components';

import './style.scss';

function generateStateFromProps({ terms }) {
  return {
    terms,
  };
}

@withI18n()
class TagSearch extends Component {
  static propTypes = {
    terms: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    i18n: PropTypes.shape({}).isRequired,
    isFetching: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.node),
  };

  static defaultProps = {
    terms: '',
    onChange: () => {},
    isFetching: false,
    errors: [],
  };

  state = {
    terms: '',
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
  }

  handleChange = (ev) => {
    const terms = ev.target.value;
    this.setState({ terms });
    this.props.onChange(terms);
  }

  handleSubmit = () => {
    if (this.state.terms.length === 0) {
      return;
    }

    this.props.onSubmit(this.state.terms);
  }

  render() {
    const { i18n, isFetching, errors } = this.props;

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
          errors={errors}
        />
        <Button
          className="m-tags-search__button"
          icon={isFetching ? (<Spinner isLoading display="inline" />) : 'plus'}
          disabled={isFetching}
          onClick={this.handleSubmit}
          aria-label={i18n._('tags.action.add', { defaults: 'Add' })}
        />
      </div>
    );
  }
}

export default TagSearch;
