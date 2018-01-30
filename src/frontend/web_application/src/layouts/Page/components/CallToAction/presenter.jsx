import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from '../../../../components/';
import './style.scss';

class Presenter extends Component {
  static propTypes = {
    availableActions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  state = {
    isFocus: false,
  };

  render() {
    const { availableActions } = this.props;

    return (
      <div className="l-call-to-action">
        <div className={classnames('m-call-to-action', { 'm-call-to-action--focus': this.state.isFocus })}>
          {
            availableActions.map((action, idx) => action.children({
              className: classnames('m-call-to-action__btn', { 'm-call-to-action__btn--disabled': !!action.disabled }),
              key: idx,
            }))
          }

          { /*
            principalAction.children({
              className: classnames('m-call-to-action__btn',
              'm-call-to-action__btn--principal',
              { 'm-call-to-action__btn--disabled': !!principalAction.disabled },
            ),
            })
           */ }

          <Button
            icon="plus"
            shape="plain"
            className={classnames('m-call-to-action__btn', 'm-call-to-action__btn--principal')}
          />
        </div>
      </div>
    );
  }
}

export default Presenter;
