import React, { Component, PropTypes } from 'react';
import Button from '../../../../Button';
import Icon from '../../../../Icon';
import './style.scss';

class AddFieldGroup extends Component {
  static propTypes = {
    template: PropTypes.element.isRequired,
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

  handleChange({ item }) {
    this.setState({ item });
  }

  handleAdd() {
    const validation = this.props.validate(this.state.item);

    if (validation.isValid) {
      this.props.onAdd({ item: this.state.item });
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
    const { template, __ } = this.props;

    return (
      <div className="m-add-field-group">
        {template({
          item: this.state.item,
          onChange: this.handleChange,
          className: 'm-add-field-group__input',
          errors: this.state.errors,
        })}
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
