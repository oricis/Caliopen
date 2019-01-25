import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ActionBarWrapper, ActionBar } from '../../components';
import { ScrollDetector } from '../../modules/scroll';
import MessageList from '../Discussion/components/MessageList';
import { withCurrentView } from './withCurrentView';

@withCurrentView()
class View extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
  };
  static defaultProps = {
    children: null,
    className: undefined,
    messages: undefined,
    isFetching: false,
  };

  renderActionBar() {
    const { isFetching } = this.props;

    return (
      <ScrollDetector
        offset={136}
        render={isSticky => (
          <ActionBarWrapper isSticky={isSticky}>
            <ActionBar
              hr={false}
              isLoading={isFetching}
              actionsNode={(
                <div className="s-view-action-bar" />
              )}
            />
          </ActionBarWrapper>
        )}
      />
    );
  }

  render() {
    const { className, messages, isFetching } = this.props;

    return (
      <div className={classnames(className)}>
        {this.renderActionBar()}
        <MessageList isFetching={isFetching} messages={messages} />
      </div>
    );
  }
}

export default View;
