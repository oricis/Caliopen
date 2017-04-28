import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../Button';
import Icon from '../../../../Icon';
import './style.scss';

function generateStateFromProps(props) {
  const item = typeof props.defaultValue === 'string' ? props.defaultValue : { ...props.defaultValue };

  return { item };
}

class AddFieldGroup extends Component {
  static propTypes = {
    template: PropTypes.func.isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
    onAdd: PropTypes.func.isRequired,
    validate: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    defaultValue: '',
    validate: () => ({
      isValid: true,
    }),
  };
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState(generateStateFromProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(generateStateFromProps(nextProps));
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
