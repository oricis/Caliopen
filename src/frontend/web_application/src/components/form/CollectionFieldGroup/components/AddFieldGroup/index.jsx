import React, { Component, PropTypes } from 'react';
import { TextFieldGroup } from '../../../';
import Button from '../../../../Button';
import Icon from '../../../../Icon';
import './style.scss';

class AddFieldGroup extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onAdd: PropTypes.func.isRequired,
    validate: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    validate: () => ({
      isValid: true,
    }),
  };
  constructor(props) {
    super(props);
    this.state = {
      item: '',
      errors: [],
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
    const validation = this.props.validate(this.state.item);

    if (validation.isValid) {
      this.props.onAdd(this.state.item);
      this.setState({
        item: '',
        errors: [],
      });
    } else {
      this.setState({
        errors: validation.errors,
      });
    }
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
          errors={this.state.errors}
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
