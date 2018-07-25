import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Switch, Route } from 'react-router-dom';
import { Button, Icon, InputText } from '../../../../components';
import ComposeButton from '../ComposeButton';
import CreateContactButton from '../CreateContactButton';
import ImportContactsButton from '../ImportContactsButton';
import './style.scss';
import './action-btns.scss';

// eslint-disable-next-line react/prefer-stateless-function
class PageActions extends Component {
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
          <Switch>
            <Route path="/discussions/:discussion_id" render={() => (<ComposeButton className="m-action-btns__btn" />)} />
            <Route
              path="/contacts"
              exact
              render={() => (
                <Fragment>
                  <CreateContactButton className="m-action-btns__btn" />
                  <ImportContactsButton className="m-action-btns__btn" />
                </Fragment>
              )}
            />
            <Route render={() => (<ComposeButton className="m-action-btns__btn" />)} />
          </Switch>
        </div>
        <div className="m-page-actions__search-field">
          <div className="m-search-field">
            <InputText className="m-search-field__search-input" />
            <Button className="m-search-field__search-button" shape="plain">
              Lancer la recherche <Icon type="search" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default PageActions;
