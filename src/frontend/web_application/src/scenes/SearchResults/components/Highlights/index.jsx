import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Highlights extends Component {
  static propTypes = {
    term: PropTypes.string,
    highlights: PropTypes.string,
  };
  static defaultProps = {
    term: '',
    highlights: '',
  };
  state = {};

  getTerms = () => {
    const { term } = this.props;

    if (!term.length) {
      return [];
    }

    return Array.from(new Set(term.split(' ')));
  }

  parseHighlight = (terms, highlight) => {
    if (!terms.length) {
      return [highlight];
    }

    const termRegExp = RegExp(`(${terms.join('|')})`, 'gi');
    const parts = [];
    let results;
    let prevIndex = 0;
    let endIndex = 0;

    // eslint-disable-next-line no-cond-assign
    while ((results = termRegExp.exec(highlight)) !== null) {
      const prefix = highlight.substr(prevIndex, results.index - prevIndex);
      prevIndex = termRegExp.lastIndex;
      endIndex = results.index + results[0].length;
      parts.push(prefix);
      parts.push(<b>{results[0]}</b>);
    }

    if (endIndex < highlight.length) {
      parts.push(highlight.substr(endIndex));
    }

    return parts;
  }

  render() {
    const { highlights } = this.props;
    const terms = this.getTerms();

    if (!highlights) {
      return null;
    }

    return (
      <span>
        {this.parseHighlight(terms, highlights).map((highlighted, idx) => (
          <span key={idx}>{highlighted}</span>
        ))}
      </span>
    );
  }
}

export default Highlights;
