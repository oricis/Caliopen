import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidv1 } from 'uuid';

import './style.scss';

class QuickReplyForm extends Component {
  static propTypes = {
    draft: PropTypes.shape({
      body: PropTypes.string.isRequired,
    }),
    parentMessage: PropTypes.shape({}),
    onSave: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    user: PropTypes.shape({}),
  };

  static defaultProps = {
    draft: { body: '' },
    onChange: () => {},
  };

  state = {
    hasChanged: false,
    id: `textarea-${uuidv1()}`,
  };

  handleSave = () => {
    const { draft } = this.state;
    this.props.onSave({ draft });
  };

  handleSend = () => {
    const { draft } = this.state;
    this.props.onSend({ draft });
  };

  handleChange = (ev) => {
    const { name, value } = ev.target;

    this.setState((prevState) => {
      const { draft } = { ...prevState.draft, [name]: value };

      return { draft, hasChanged: true };
    }, () => {
      this.props.onChange({ draft: this.state.draft });
    });
  }

  render() {
    const { id } = this.state;

    return (
      <div className="m-quick-reply">
        <textarea
          id={id}
          name="body"
          onChange={this.handleChange}
          placeholder="Réponse rapide"
        >
          {this.props.draft.body}
        </textarea>
      </div>
    );
  }
}

export default QuickReplyForm;
