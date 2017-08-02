import React, { Component } from 'react';
// import PropTypes from 'prop-types';


class PasswordForm extends Component {
  static propTypes = {
    // __: PropTypes.func.isRequired,
    // requestUser: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  componentDidMount() {
    // this.props.requestUser();
  }

  render() {
    return (
      <div className="m-tfa-form" />
    );
  }
}

export default PasswordForm;
