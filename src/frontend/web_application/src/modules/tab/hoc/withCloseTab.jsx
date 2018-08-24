import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchPath, withRouter } from 'react-router-dom';
import TabConsumer from '../components/TabConsumer';

export const withCloseTab = () =>
  (C) => {
    @withRouter
    class Wrapper extends Component {
      static displayName = `withCloseTab(${C.displayName || C.name || 'Component'})`;
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
            render={({ tabs, removeTab }) => {
              const currentTab = tabs.find(tab => matchPath(match.url, tab.routeConfig));
              const closeTab = tab => removeTab({ tab: tab || currentTab });

              return (
                <C closeTab={closeTab} {...props} />
              );
            }}
          />
        );
      }
    }

    return Wrapper;
  };
