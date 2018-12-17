import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Spinner from '../Spinner';
import './style.scss';

class ActionBar extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isFetching: PropTypes.bool,
    actionsNode: PropTypes.node,
    hr: PropTypes.bool,
  };
  static defaultProps = {
    children: null,
    className: undefined,
    isFetching: false,
    hr: true,
    actionsNode: null,
  };

  render() {
    const {
      className, isFetching, actionsNode, hr, children,
    } = this.props;

    return (
      <div
        className={classnames(className, 'm-action-bar', {
          'm-action-bar--hr': hr,
        })}
      >
        {isFetching && (
          <div className="m-action-bar__loading">
            <Spinner isLoading={isFetching} display="inline" />
          </div>
        )}
        {actionsNode && (
          <div className="m-action-bar__actions">
            {actionsNode}
          </div>
        )}
        {children}
      </div>
    );
  }
}

export default ActionBar;
