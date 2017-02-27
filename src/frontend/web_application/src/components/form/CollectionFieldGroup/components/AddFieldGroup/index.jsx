import React, { Component, PropTypes } from 'react';
import { TextFieldGroup } from '../../../';
import Button from '../../../../Button';
import Icon from '../../../../Icon';
import './style.scss';

class AddFieldGroup extends Component {
  static propTypes = {
    label: PropTypes.string,
    onAdd: PropTypes.func,
    __: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      item: '',
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.setState({
      item: ev.target.value,
    });
  }

  handleAdd() {
    this.props.onAdd(this.state.item);
    this.setState({
      item: '',
    });
  }

  render() {
    const { label, __ } = this.props;

    return (
      <div className="m-add-field-group">
        <TextFieldGroup
          label={label}
          placeholder={label}
          name="item"
          value={this.state.item}
          onChange={this.handleChange}
          className="m-add-field-group__input"
          showLabelforSr
        />
        <Button
          plain
          inline
          className="m-add-field-group__button"
          onClick={this.handleAdd}
          disabled={this.state.item.length === 0}
        >
          <span className="show-for-sr">{__('collection-field-group.action.add')}</span>
          <Icon type="plus" />
        </Button>
      </div>
    );
  }
}

export default AddFieldGroup;
