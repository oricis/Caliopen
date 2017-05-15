import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AsyncLoad extends Component {
  static propTypes = {
    load: PropTypes.instanceOf(Promise).isRequired,
    loadProps: PropTypes.shape({}),
    loading: PropTypes.element,
  };
  static defaultProps = {
    loadProps: {},
    loading: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      component: undefined,
    };
  }

  componentDidMount() {
    this.props.load.then(({ default: component }) => this.setState({ component }));
  }

  render() {
    const { loadProps, loading } = this.props;

    if (this.state.component) {
      return (<this.state.component {...loadProps} />);
    }

    return (loading) ? (<loading.type {...loading.props} />) : null;
  }
}

export default AsyncLoad;
