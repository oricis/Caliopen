import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ActionBarWrapper, ActionBar } from '../../components';
import { ScrollDetector } from '../../modules/scroll';
import { withCurrentView } from './withCurrentView';
import MessageItem from './components/MessageItem';
import './style.scss';

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
    const { className, messages } = this.props;

    return (
      <div className={classnames(className)}>
        {this.renderActionBar()}
        <div>
          {messages.map(message => (
            <MessageItem key={message.message_id} message={message} className="s-view__message" />
          ))}
        </div>
      </div>
    );
  }
}

export default View;
