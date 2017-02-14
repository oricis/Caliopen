import React, { Component, PropTypes } from 'react';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { TextFieldGroup } from '../../../form';

import './style.scss';

class TagInput extends Component {
  static propTypes = {
    tag: PropTypes.string,
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
    let displayTag = '';
    if (this.state.edit) {
      displayTag = (
        <div className="m-tag">
          <TextFieldGroup
            id={this.props.tag}
            name={this.props.tag}
            className="m-tag__input"
            label={this.props.tag}
            placeholder={this.props.tag}
            defaultValue={this.props.tag}
            showLabelforSr
            autoFocus
          />
          <Button className="m-tag__button" inline onClick={this.handleClick}><Icon className="m-tag__icon" type="check" /></Button>
        </div>
      );
    } else {
      displayTag = (
        <div className="m-tag m-tag--button">
          <Button
            className="m-tag__button"
            onClick={this.handleClick}
            expanded
          >
            <span className="m-tag__text">{this.props.tag}</span>
            <Icon className="m-tag__icon" type="edit" />
          </Button>
        </div>
      );
    }

    return displayTag;
  }
}

export default TagInput;
