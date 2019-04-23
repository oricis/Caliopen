import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ComposeButton from '../ComposeButton';
import { SearchField } from '../../../search';
import './style.scss';
import './action-btns.scss';

class PageActions extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: undefined,
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames(className, 'm-page-actions')}>
        <div className="m-page-actions__action-btns m-action-btns">
          <ComposeButton className="m-action-btns__btn" />
        </div>
        <SearchField className="m-page-actions__search-field" />
      </div>
    );
  }
}

export default PageActions;
