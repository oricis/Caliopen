import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans } from 'lingui-react';
import { Icon, InputText, Button } from '../../../../components/';
import './style.scss';
// import RawButton from '../../../../components/RawButton';

const generateStateFromProps = ({ term }) => ({ term });

const SEARCH_PATH = '/search-results';
const MIN_TERM_LENGTH = 3;

class SearchField extends Component {
  static propTypes = {
    className: PropTypes.string,
    term: PropTypes.string,
    push: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    term: '',
  };
  state = {
    term: '',
  };

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(generateStateFromProps(nextProps));
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { push } = this.props;
    const { term } = this.state;
    push(`${SEARCH_PATH}?term=${term}`);
  }

  handleInputChange = (event) => {
    const { target } = event;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const { i18n, className } = this.props;

    return (
      <div className={classnames('m-search-field', className)}>
        <form action="/search-results" method="get" onSubmit={this.handleSubmit}>
          <InputText
            name="term"
            onChange={this.handleInputChange}
            value={this.state.term}
            placeholder={i18n._('header.menu.search', { defaults: 'Search' })}
            className="m-search-field__search-input"
          />
          <Button
            className="m-search-field__search-button"
            type="submit"
            shape="plain"
            disabled={this.state.term.length < MIN_TERM_LENGTH}
          >
            <Trans id="header.actions.search">Lancer la recherche <Icon type="search" /></Trans>
          </Button>
        </form>
      </div>
    );
  }
}

export default SearchField;
