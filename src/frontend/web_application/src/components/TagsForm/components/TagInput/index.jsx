import React, { Component, PropTypes } from 'react';
import Button from '../../../Button';
import Icon from '../../../Icon';
import { TextFieldGroup } from '../../../form';


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
        <div className="m-tags__item">
          <TextFieldGroup
            id={this.props.tag}
            name={this.props.tag}
            className="m-tags__item-input"
            placeholder={this.props.tag}
            defaultValue={this.props.tag}
            autoFocus
          />
          <Button inline onClick={this.handleClick}><Icon type="check" spaced /></Button>
        </div>
      );
    } else {
      displayTag = (
        <Button
          className="m-tags__item m-tags__item--button"
          onClick={this.handleClick}
          expanded
        >
          <span className="m-tags__text">{this.props.tag}</span>
          <Icon className="m-tags__icon" type="edit" spaced />
        </Button>
      );
    }

    return displayTag;
  }
}

export default TagInput;
