import React, { Component } from 'react';
import { WithSettings } from '../../../settings';
import { WithUser } from '../../../user';

export const withAuthenticatedProps = () => (C) => {
  class Wrapper extends Component {
    renderComponent({
      settings, isSettingsFetching, user, isUserFetching,
    }) {
      const isFetching = isUserFetching || isSettingsFetching;

      return (
        <C settings={settings} user={user} isFetching={isFetching} {...this.props} />
      );
    }

    render() {
      return (
        <WithSettings
          render={
            (settings, isSettingsFetching) => (
              <WithUser
                render={
                  (user, isUserFetching) =>
                    this.renderComponent({
                      settings, isSettingsFetching, user, isUserFetching,
                    })
                }
              />
            )
          }
        />
      );
    }
  }

  return Wrapper;
};
