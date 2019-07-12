import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withAuthorizePopup} from './withAuthorizePopup';
import {getProvider} from '../services/getProvider';

export const withAuthorize = () => (C) => {
  @withAuthorizePopup()
  class Wrapper extends Component {
    static propTypes = {
      initPopup: PropTypes.func.isRequired,
      authorizePopup: PropTypes.func.isRequired,
    }

    authorize = async ({providerName, identifier}) => {
      const {
        initPopup, authorizePopup,
      } = this.props;

      try {
        const provider = await getProvider({providerName, identifier});
        initPopup({providerName});
        return authorizePopup({provider});
      } catch (e) {
        if (e.response) {
          throw e
        }
      }

    }

    render() {
      const {
        initPopup, authorizePopup, ...props
      } = this.props;

      return (
        <C authorize={this.authorize} {...props} />
      );
    }
  }

  return Wrapper;
};
