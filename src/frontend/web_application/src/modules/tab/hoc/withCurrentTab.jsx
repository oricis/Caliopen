import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchPath, withRouter } from 'react-router-dom';
import TabConsumer from '../components/TabConsumer';

export const withCurrentTab = () =>
  (C) => {
    @withRouter
    class Wrapper extends Component {
      static displayName = `withCurrentTab(${C.displayName || C.name || 'Component'})`;
      static propTypes = {
        match: PropTypes.shape({}).isRequired,
        location: PropTypes.shape({}).isRequired,
        history: PropTypes.shape({}).isRequired,
      }

      render() {
        const {
          match, location, history, ...props
        } = this.props;

        return (
          <TabConsumer
            render={({ tabs }) => {
              const currentTab = tabs.find(tab => matchPath(match.url, tab.routeConfig));

              return (
                <C currentTab={currentTab} {...props} />
              );
            }}
          />
        );
      }
    }

    return Wrapper;
  };
